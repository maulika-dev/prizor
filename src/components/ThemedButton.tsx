import React from 'react';
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';

import { useThemeColors } from '../theme/useTheme';
import ThemedText from './ThemedText';

type ButtonVariant = 'primary' | 'ghost' | 'secondary';

type Props = {
	label: string;
	onPress: () => void;
	variant?: ButtonVariant;
	disabled?: boolean;
	loading?: boolean;
	style?: ViewStyle;
	rightIcon?: React.ReactNode;
	leftIcon?: React.ReactNode;
};

const getButtonStyle =
	(
		variant: ButtonVariant,
		disabled: boolean,
		colors: ReturnType<typeof useThemeColors>,
	) =>
		(pressed: boolean): ViewStyle => {
			if (variant === 'primary') {
				return {
					backgroundColor: colors.primary,
					opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
					shadowColor: colors.cardShadow,
					shadowOpacity: 0.25,
					shadowRadius: 10,
					shadowOffset: { width: 0, height: 8 },
					elevation: 6,
				};
			}

			if (variant === 'secondary') {
				return {
					backgroundColor: colors.accentBackground,
					borderWidth: 0,
					opacity: disabled ? 0.6 : pressed ? 0.9 : 1,
				};
			}

			return {
				backgroundColor: 'transparent',
				borderWidth: 1,
				borderColor: colors.border,
				opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
			};
		};

export const ThemedButton: React.FC<Props> = ({
	label,
	onPress,
	variant = 'primary',
	disabled = false,
	loading = false,
	style,
	rightIcon,
	leftIcon,
}) => {
	const colors = useThemeColors();

	const primaryTextColor = '#ffffff';

	return (
		<Pressable
			accessibilityRole="button"
			disabled={disabled || loading}
			onPress={onPress}
			style={({ pressed }) => [
				styles.button,
				getButtonStyle(variant, disabled, colors)(pressed),
				style,
			]}>
			{loading ? (
				<ActivityIndicator color={colors.primaryText} />
			) : (
				<View style={styles.contentRow}>
					{leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
					<ThemedText
						variant="button"
						style={{
							color:
								variant === 'primary'
									? primaryTextColor
									: variant === 'secondary'
										? colors.text
										: colors.text,
						}}>
						{label}
					</ThemedText>
					{rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
				</View>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		borderRadius: 14,
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 12,
		flexDirection: 'row',
		minHeight: 56,
	},
	contentRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		marginHorizontal: 8,
	},
});

export default ThemedButton;
