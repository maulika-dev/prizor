import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	Dimensions,
	Alert,
	ScrollView,
	Image,
	Pressable
} from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import {
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
} from 'react-native-webrtc';

import { Client, Message } from 'paho-mqtt';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ZoomIn, ZoomOut, Camera, Video as VideoIcon, Mic, ChevronDown, ChevronLeft, TvMinimalPlay, SquareMenu } from "lucide-react-native";
import { useThemeColors } from '../../theme/useTheme';
import ViewShot, { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const { width, height } = Dimensions.get('window');

// 🔧 MQTT CONFIG
const MQTT_HOST = '13.201.74.116';
const MQTT_PORT = 9001;
const MQTT_USERNAME = 'streammqttuser';
const MQTT_PASSWORD = 'Admin123';

const MQTT_PUB_TOPIC = 'b/conn/b86962cd-ad9b-4a3f-ab05-a02754547c61'; // offer + candidates outbound
const MQTT_SUB_TOPIC = 'animals-publishTest1'; // answer + candidates inbound

const ICE_SERVERS = [{ urls: 'stun:stun1.ap-in-1.anedya.io:3478' }];
const ICE_GATHER_TIMEOUT_MS = 1500;

export default function CameraPreviewScreen() {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const [selectedTab, setSelectedTab] = useState<'Preview' | 'Playback' | 'Events'>('Preview');
	// const viewShotRef = useRef<ViewShot>(null);
	const startedRef = useRef(false);
	const shotRef = useRef<View>(null);

	// viewer state
	const [logs, setLogs] = useState<string[]>([]);
	const [mqttConnected, setMqttConnected] = useState(false);
	const [webrtcConnected, setWebrtcConnected] = useState(false);
	const [streamUrl, setStreamUrl] = useState<string | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

	const pcRef = useRef<RTCPeerConnection | null>(null);
	const mqttRef = useRef<Client | null>(null);
	const remoteDescSetRef = useRef(false);
	const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);
	const [lastShotUri, setLastShotUri] = useState<string | null>(null);
	const thumbTimerRef = useRef<NodeJS.Timeout | null>(null);

	const log = useCallback((msg: string) => {
		const ts = new Date().toISOString().split('T')[1].replace('Z', '');
		setLogs(prev => [...prev, `[${ts}] ${msg}`]);
	}, []);

	const cleanup = useCallback(() => {
		try {
			mqttRef.current?.disconnect();
		} catch { }
		mqttRef.current = null;

		try {
			pcRef.current?.getTransceivers?.()?.forEach((tx: any) => tx.stop?.());
			pcRef.current?.close?.();
		} catch { }
		pcRef.current = null;

		remoteDescSetRef.current = false;
		pendingCandidatesRef.current = [];

		setMqttConnected(false);
		setWebrtcConnected(false);
		setStreamUrl(null);
		setRemoteStream(null);

		console.log('[CLEANUP] done');
	}, [log]);

	useEffect(() => {
		return () => cleanup();
	}, [cleanup]);

	useEffect(() => {
		start();
		return () => cleanup();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		return () => {
			if (thumbTimerRef.current) clearTimeout(thumbTimerRef.current);
		};
	}, []);

	// const captureScreenshot = async () => {
	// 	try {
	// 		if (!shotRef.current) {
	// 			Alert.alert("Error", "Stream not ready");
	// 			return;
	// 		}

	// 		const uri = await captureRef(shotRef.current, {
	// 			format: "jpg",
	// 			quality: 0.95,
	// 			result: "tmpfile",
	// 			handleGLSurfaceViewOnAndroid: true,
	// 		});

	// 		await CameraRoll.saveAsset(uri, { type: "photo", album: "NXON-Surveillance" });
	// 		Alert.alert("Success", "Screenshot saved to gallery");
	// 	} catch (err: any) {
	// 		console.log("Screenshot error:", err);
	// 		Alert.alert("Error", err?.message ?? "Screenshot failed");
	// 	}
	// };


	const captureScreenshot = async () => {
		try {
			if (!shotRef.current) {
				Alert.alert("Error", "Stream not ready");
				return;
			}
			if (!streamUrl) {
				Alert.alert("Error", "No stream");
				return;
			}

			const uri = await captureRef(shotRef.current, {
				format: "jpg",
				quality: 0.95,
				result: "tmpfile",
				handleGLSurfaceViewOnAndroid: true,
			});

			// save to gallery
			await CameraRoll.saveAsset(uri, { type: "photo", album: "NXON-Surveillance" });

			// ✅ show thumbnail preview
			setLastShotUri(uri);

			// auto-hide after 3 sec
			if (thumbTimerRef.current) clearTimeout(thumbTimerRef.current);
			thumbTimerRef.current = setTimeout(() => setLastShotUri(null), 3000);

			// optional toast
			// Alert.alert("Saved", "Saved to album");
			console.log("[NXON:SNAP] saved ->", uri);
		} catch (err: any) {
			console.log("[NXON:SNAP] error:", err);
			Alert.alert("Error", err?.message ?? "Screenshot failed");
		}
	};


	// ---- SIGNAL HANDLER (incoming answer/candidate) ----
	const handleSignalMessage = useCallback(async (topic: string, payloadStr: string) => {
		if (topic !== MQTT_SUB_TOPIC) return;

		console.log(`[SIGNAL_IN] ${payloadStr}`);

		let data: any;
		try {
			data = JSON.parse(payloadStr);
		} catch {
			console.log('[SIGNAL_IN] Invalid JSON');
			return;
		}

		const pc = pcRef.current;
		if (!pc) return;

		if (data.type === 'answer' || data.type === 'offer') {
			console.log(`[WEBRTC] SDP ${data.type} received`);
			const desc = new RTCSessionDescription({ type: data.type, sdp: data.sdp });

			try {
				await pc.setRemoteDescription(desc);
				remoteDescSetRef.current = true;
				console.log('[WEBRTC] RemoteDescription set ✅');

				// apply buffered ICE
				for (const ice of pendingCandidatesRef.current) {
					try {
						await pc.addIceCandidate(ice);
					} catch (e) {
						console.log('[WEBRTC] Failed add buffered ICE: ' + String(e));
					}
				}
				pendingCandidatesRef.current = [];
			} catch (e) {
				console.log('[WEBRTC] setRemoteDescription failed: ' + String(e));
			}
		}

		if (data.type === 'candidate') {
			const candInit = {
				candidate: data.candidate,
				sdpMLineIndex: typeof data.label === 'number' ? data.label : 0,
				sdpMid: typeof data.sdpMid === 'string' ? data.sdpMid : '0',
			};

			let ice: RTCIceCandidate;
			try {
				ice = new RTCIceCandidate(candInit);
			} catch (e) {
				console.log('[WEBRTC] Bad ICE: ' + String(e));
				return;
			}

			if (remoteDescSetRef.current) {
				try {
					await pc.addIceCandidate(ice);
					console.log('[WEBRTC] ICE added ✅');
				} catch (e) {
					console.log('[WEBRTC] addIceCandidate failed: ' + String(e));
				}
			} else {
				pendingCandidatesRef.current.push(ice);
				console.log('[WEBRTC] ICE buffered (waiting SDP)');
			}
		}
	}, [log]);

	// ---- MQTT CONNECT ----
	const connectMQTT = useCallback(() => {
		const clientId = 'rn-' + Math.random().toString(16).slice(2);
		console.log(`[MQTT] create ws://${MQTT_HOST}:${MQTT_PORT} clientId=${clientId}`);

		const client = new Client(MQTT_HOST, MQTT_PORT, clientId);

		client.onConnectionLost = resp => {
			setMqttConnected(false);
			console.log(`[MQTT] lost: ${resp.errorCode} ${resp.errorMessage}`);
		};

		client.onMessageArrived = (message: Message) => {
			const topic = message.destinationName;
			const payloadStr = message.payloadString ?? '';
			handleSignalMessage(topic, payloadStr);
		};

		client.connect({
			timeout: 5,
			cleanSession: true,
			useSSL: false,
			userName: MQTT_USERNAME,
			password: MQTT_PASSWORD,
			onSuccess: () => {
				setMqttConnected(true);
				console.log('[MQTT] connected ✅');
				client.subscribe(MQTT_SUB_TOPIC);
				console.log(`[MQTT] subscribed ${MQTT_SUB_TOPIC}`);
			},
			onFailure: err => {
				setMqttConnected(false);
				console.log('[MQTT] connect failed: ' + JSON.stringify(err));
			},
		});

		mqttRef.current = client;
		return client;
	}, [handleSignalMessage, log]);

	// ---- START VIEWER ----
	const start = useCallback(async () => {
		try {
			cleanup();
			console.log('[START] begin MQTT + WebRTC');

			const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
			pcRef.current = pc;

			// IMPORTANT: send local ICE candidates to MQTT
			(pc as any).onicecandidate = (event: any) => {
				if (!event.candidate) return;
				const candMsg = {
					type: 'candidate',
					candidate: event.candidate.candidate,
					label: event.candidate.sdpMLineIndex,
					sdpMid: event.candidate.sdpMid,
				};
				try {
					mqttRef.current?.send(MQTT_PUB_TOPIC, JSON.stringify(candMsg));
					console.log('[WEBRTC] local ICE -> MQTT');
				} catch (e) {
					console.log('[WEBRTC] local ICE send fail: ' + String(e));
				}
			};

			(pc as any).oniceconnectionstatechange = () => console.log(`[WEBRTC] ice=${pc.iceConnectionState}`);
			(pc as any).onconnectionstatechange = () => console.log(`[WEBRTC] pc=${pc.connectionState}`);

			(pc as any).ontrack = (event: any) => {
				const stream: MediaStream = event.streams?.[0];
				if (!stream) return;
				setRemoteStream(stream);
				setStreamUrl(stream.toURL());
				setWebrtcConnected(true);
				console.log('[WEBRTC] ontrack ✅ streamURL set');
			};

			const mqttClient = connectMQTT();
			pc.addTransceiver('video', { direction: 'recvonly' });
			const offer = await pc.createOffer({
				offerToReceiveVideo: true,
				offerToReceiveAudio: false,
			});

			if (!offer?.sdp || !offer?.type) {
				Alert.alert('Invalid offer', 'Offer has no SDP/type');
				return;
			}
			console.log('[WEBRTC] offer created');
			console.log(offer);
			await pc.setLocalDescription(new RTCSessionDescription(offer));
			await waitICE(pc, ICE_GATHER_TIMEOUT_MS);

			// publish offer
			mqttClient.send(MQTT_PUB_TOPIC, JSON.stringify(pc.localDescription));
			console.log('[SIGNAL_OUT] offer published ✅');
		} catch (e: any) {
			log('[START_ERROR] ' + (e?.message ?? String(e)));
		}
	}, [cleanup, connectMQTT, log]);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#fff" />

			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton}>
					<ChevronLeft size={30} />
				</TouchableOpacity>

				<View>
					<Text style={styles.headerTitle}>Title</Text>
					<Text style={styles.headerSub}>
						MQTT: {mqttConnected ? 'Connected' : 'Disconnected'} • WebRTC: {webrtcConnected ? 'Streaming' : 'Idle'}
					</Text>
				</View>

				<View style={styles.headerRight}>
					<TouchableOpacity style={styles.iconButton}>
						<TvMinimalPlay />
					</TouchableOpacity>
					<TouchableOpacity style={styles.iconButton}>
						<SquareMenu />
					</TouchableOpacity>
				</View>
			</View>

			{/* Stream (replaces react-native-video) */}
			<View style={styles.videoContainer}>
				<ViewShot
					options={{
						format: "jpg",
						quality: 0.95,
						result: "tmpfile",
						handleGLSurfaceViewOnAndroid: true,
					}}
				>
					<View
						ref={shotRef}
						collapsable={false}
						renderToHardwareTextureAndroid={true}
						style={styles.videoContainer}
					>
						{streamUrl ? (
							<RTCView
								streamURL={streamUrl}
								style={styles.video}
								objectFit="cover"
								zOrder={0}
							/>
						) : (
							<View style={[styles.video, styles.videoPlaceholder]}>
								<Text style={styles.placeholderText}>
									{mqttConnected ? "Waiting for stream…" : "Connecting…"}
								</Text>
							</View>
						)}

						{/* ✅ ADD THUMBNAIL HERE (overlay on video) */}
						{lastShotUri && (
							<Pressable style={styles.thumbWrap} onPress={() => setLastShotUri(null)}>
								<Image source={{ uri: lastShotUri }} style={styles.thumbImg} />
							</Pressable>
						)}
					</View>
				</ViewShot>
			</View>


			{/* Action Buttons */}
			<View style={styles.actionBar}>
				<TouchableOpacity style={styles.actionButton} onPress={captureScreenshot}>
					<View style={styles.actionIcon}>
						<Camera strokeWidth={1.75} size={20} color="#fff" absoluteStrokeWidth />
					</View>
					<Text style={styles.actionLabel}>Capture</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionButton}>
					<View style={styles.actionIcon}>
						<VideoIcon strokeWidth={1.75} size={20} color="#fff" absoluteStrokeWidth />
					</View>
					<Text style={styles.actionLabel}>Record</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionButton}>
					<View style={styles.actionIcon}>
						<Mic strokeWidth={1.75} size={20} color="#fff" absoluteStrokeWidth />
					</View>
					<Text style={styles.actionLabel}>Talk</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionButton}>
					<View style={styles.actionIcon}>
						<Text style={styles.actionIconText}>SD</Text>
					</View>
					<Text style={styles.actionLabel}>Storage</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.actionButton}>
					<View style={styles.actionIcon}>
						<ChevronDown strokeWidth={1.75} size={20} color="#fff" absoluteStrokeWidth />
					</View>
					<Text style={styles.actionLabel}>More</Text>
				</TouchableOpacity>
			</View>

			{/* PTZ Controls */}
			<View style={styles.controlsContainer}>
				<View style={styles.ptzControl}>
					<View style={styles.centerCircle} />
					<View style={[styles.directionButton, styles.upButton]}><Text style={styles.directionIcon}>▲</Text></View>
					<View style={[styles.directionButton, styles.leftButton]}><Text style={styles.directionIcon}>◀</Text></View>
					<View style={[styles.directionButton, styles.rightButton]}><Text style={styles.directionIcon}>▶</Text></View>
					<View style={[styles.directionButton, styles.downButton]}><Text style={styles.directionIcon}>▼</Text></View>
				</View>

				<View style={styles.zoomControls}>
					<TouchableOpacity style={styles.zoomButton}><ZoomIn /></TouchableOpacity>
					<TouchableOpacity style={styles.zoomButton}><ZoomOut /></TouchableOpacity>
					<Text style={styles.zoomLabel}>Zoom</Text>
				</View>
			</View>

			{/* Bottom Tabs */}
			<View style={styles.tabBar}>
				{(['Preview', 'Playback', 'Events'] as const).map(tab => (
					<TouchableOpacity key={tab} style={styles.tab} onPress={() => setSelectedTab(tab)}>
						<Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</Text>
						{selectedTab === tab && <View style={styles.tabIndicator} />}
					</TouchableOpacity>
				))}
			</View>

			{/* Optional: logs to debug in same screen */}
			{/* <ScrollView style={styles.logBox}>
				{logs.slice(-80).map((line, idx) => (
					<Text key={idx} style={styles.logText}>{line}</Text>
				))}
			</ScrollView> */}

		</SafeAreaView>
	);
}

async function waitICE(pc: RTCPeerConnection, timeout = 1500) {
	if (pc.iceGatheringState === 'complete') return;
	await new Promise(resolve => {
		const t = setTimeout(resolve, timeout);
		(pc as any).onicegatheringstatechange = () => {
			if (pc.iceGatheringState === 'complete') {
				clearTimeout(t);
				resolve(null);
			}
		};
	});
}

const createStyles = (colors: any) =>
	StyleSheet.create({
		container: { flex: 1, backgroundColor: '#f0f0f0' },

		header: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: 16,
			paddingVertical: 12,
			backgroundColor: '#fff',
			borderBottomWidth: 1,
			borderBottomColor: '#e0e0e0',
		},
		backButton: { width: 40, height: 40, justifyContent: 'center' },
		headerTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
		headerSub: { fontSize: 12, color: '#666', marginTop: 2 },
		headerRight: { flexDirection: 'row', gap: 4 },
		iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

		videoContainer: {
			width,
			height: width * 0.5625,
			backgroundColor: '#000',
		},
		video: { width: '100%', height: '100%' },
		videoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
		placeholderText: { color: '#bbb' },

		actionBar: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			paddingVertical: 12,
			backgroundColor: '#fff',
			borderBottomWidth: 1,
			borderBottomColor: '#e8e8e8',
		},
		actionButton: { alignItems: 'center', gap: 6 },
		actionIcon: {
			width: 30,
			height: 30,
			borderRadius: 22,
			backgroundColor: '#000',
			justifyContent: 'center',
			alignItems: 'center',
		},
		actionLabel: { fontSize: 11, color: '#444' },
		actionIconText: { color: '#fff', fontSize: 10, fontWeight: '700' },

		controlsContainer: {
			flex: 1,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: Math.max(height * 0.03, 20),
			paddingHorizontal: 20,
			backgroundColor: '#f0f0f0',
		},
		ptzControl: {
			width: Math.min(width * 0.55, 240),
			height: Math.min(width * 0.55, 240),
			borderRadius: Math.min(width * 0.275, 120),
			backgroundColor: '#fff',
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.08,
			shadowRadius: 8,
			elevation: 4,
			position: 'relative',
		},
		directionButton: { position: 'absolute', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
		upButton: { top: '0%', left: '50%', marginLeft: -20 },
		downButton: { bottom: '0%', left: '50%', marginLeft: -20 },
		leftButton: { left: '0%', top: '50%', marginTop: -20 },
		rightButton: { right: '0%', top: '50%', marginTop: -20 },
		directionIcon: { fontSize: 22, color: '#615d5db7' },
		centerCircle: { width: '50%', height: '50%', borderRadius: 1000, backgroundColor: '#f5f5f5' },

		zoomControls: { alignItems: 'center', marginRight: -50, marginLeft: 20, gap: 8 },
		zoomButton: {
			width: Math.min(width * 0.12, 40),
			height: Math.min(width * 0.12, 40),
			borderRadius: 50,
			backgroundColor: '#fff',
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.08,
			shadowRadius: 4,
			position: 'relative',
		},
		zoomLabel: { fontSize: 13, color: '#666', marginTop: 4 },

		tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e8e8e8' },
		tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative' },
		tabText: { fontSize: 18, color: '#999', fontWeight: '800' },
		tabTextActive: { color: colors.primary, fontWeight: '500' },
		tabIndicator: { position: 'absolute', bottom: 0, width: '30%', height: 2, backgroundColor: colors.primary },

		logBox: {
			backgroundColor: '#111',
			padding: 10,
			maxHeight: 180,
		},
		logText: { color: '#9bd1ff', fontSize: 11, marginBottom: 2 },

		thumbWrap: {
			position: "absolute",
			left: 12,
			bottom: 12,
			width: 120,
			height: 80,
			borderRadius: 10,
			overflow: "hidden",
			borderWidth: 3,
			borderColor: "#000",
			backgroundColor: "#000",
			elevation: 6,
		},
		thumbImg: {
			width: "100%",
			height: "100%",
			resizeMode: "cover",
		},
	});
