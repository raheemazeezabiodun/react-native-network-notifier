import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH, COLOR_ONLINE, COLR_OFFLINE, COLOR_WHITE } from './config';

const styles = StyleSheet.create({
    topPosition: {
        top: 5
    },
    bottomPosition: {
        bottom: 5
    },
    networkContainer: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        position: 'absolute'
    },
    networkText: {
        color: COLOR_WHITE
    },
    offlineContainer: {
        backgroundColor: COLR_OFFLINE
    },
    onlineContainer: {
        backgroundColor: COLOR_ONLINE
    }
});

export { styles as default };
