import React from 'react';
import {
	StyleSheet,
	TextInput,
	TextInputProps,
	View,
	ViewStyle,
} from 'react-native';

import { useThemeColors } from '../theme/useTheme';
import ThemedText from './ThemedText';

type Props = TextInputProps & {
	label?: string;
	containerStyle?: ViewStyle;
	leftAdornment?: React.ReactNode;
	rightAdornment?: React.ReactNode;
};

export const InputField: React.FC<Props> = ({
	label,
	containerStyle,
	leftAdornment,
	rightAdornment,
	style,
	...rest
}) => {
	const colors = useThemeColors();
	const wrapperStyle = [
		styles.inputWrapper,
		{
			borderColor: colors.border,
			backgroundColor: colors.inputBackground,
		},
	];
	const leftStyle = [
		styles.leftAdornment,
		{ borderColor: colors.border },
	];

	return (
		<View style={containerStyle}>
			{label ? (
				<ThemedText style={styles.label}>{label}</ThemedText>
			) : null}
				<View style={wrapperStyle}>
					{leftAdornment ? (
					<View style={leftStyle}>
						{leftAdornment}
					</View>
					) : null}
				<TextInput
					{...rest}
					placeholderTextColor={colors.placeholder}
					style={[
						styles.input,
						{ color: colors.text },
						leftAdornment ? styles.inputWithAdornment : null,
						style,
					]}
				/>
				{rightAdornment ? (
					<View style={styles.rightAdornment}>{rightAdornment}</View>
				) : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		marginBottom: 10,
		fontSize: 16,
		fontWeight: '500',
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 10,
		overflow: 'hidden',
	},
	leftAdornment: {
		minWidth: 80,
		paddingVertical: 12,
		paddingHorizontal: 12,
		borderRightWidth: 1,
		justifyContent: 'center',
	},
	input: {
		flex: 1,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 18,
	},
	inputWithAdornment: {
		paddingLeft: 10,
	},
	rightAdornment: {
		paddingRight: 12,
		paddingLeft: 6,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default InputField;
