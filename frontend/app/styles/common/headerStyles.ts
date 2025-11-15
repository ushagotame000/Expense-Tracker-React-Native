import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (SCREEN_WIDTH / 375) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Breakpoints for different screen sizes
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeDevice = SCREEN_WIDTH >= 768;

export const headerStyles = StyleSheet.create({
    imageBackground: {
        height: verticalScale(300),
        maxHeight: SCREEN_HEIGHT * 0.4,
        minHeight: 200,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(40),
        paddingHorizontal: scale(20),
        minHeight: moderateScale(50),
    },
    iconButton: {
        borderRadius: moderateScale(10),
        padding: scale(2),
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        flex: 1,
        paddingHorizontal: scale(10),
    }
});