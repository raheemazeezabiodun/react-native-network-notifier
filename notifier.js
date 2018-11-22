/*
*   Network Status Component
*
*   States
*        - notificationPosition: specify the position of the toast component, defaults to top
*        - showOnline: if network status changes from offline to online, should a toast being shown? defaults to true
*        - onlineTimeoutSeconds: timeout seconds for online component because we can't keep showing the online component when network
*            status changes from offline to online
*        - isConnected: is the user connected or not
*        - previousOffline: if the user launches the app and is connected initially, we don't need to notify the user about the network
*            status, only notify the user when the status was initially offline
*        - onlineVisibility: this sets to false after the timeout seconds to avoid showing the online status to the user

*    Props
*        - position: toast position, enum : ['top', 'bottom']
*        - showOnline: boolean, defaults to true
*        - offlineText: string, defaults to 'No Connection'
*        - offlineComponent: Custom React Component
*        - onlineText: string, defaults to 'Back Online'
*        - onlineComponent: Custom React Component
*        - onlineTimeoutSeconds: number, defaults to 3000
*/


import React from 'react';
import { View, Text, NetInfo } from 'react-native';

import styles from './styles';
import { DEFAULT_ONLINE_TEXT, DEFAULT_OFFLINE_TEXT, TOP_POSITION, DEFAULT_TIMEOUT_SECONDS } from './config';


export default class OfflineNotice extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            notificationPosition: props.position || TOP_POSITION,
            showOnline: props.showOnline || true,
            onlineTimeoutSeconds: props.onlineTimeoutSeconds || DEFAULT_TIMEOUT_SECONDS,
            isConnected: true,
            previouslyOffline: false,
            onlineVisibility: true
        };
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleNetworkChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleNetworkChange);
    }

    componentDidUpdate() {
        const { isConnected, onlineTimeoutSeconds } = this.state;
        if (isConnected) {
            setTimeout(() => {
                this.setState({ onlineVisibility: false });
            }, onlineTimeoutSeconds);
        } else {
            this.setState({ onlineVisibility: true });
        }
        this.setState({ previouslyOffline: true });
    }

    handleNetworkChange = (isConnected) => {
        this.setState({ isConnected });
    };

    renderOfflineMessage = (position) => {
        const { offlineComponent, offlineText } = this.props;
        let component = offlineComponent;
        const toastText = offlineText ? offlineText : DEFAULT_OFFLINE_TEXT;
        if (!offlineComponent) {
            component = (
                <View style={[styles.networkContainer, styles.offlineContainer, position]}>
                    <Text style={styles.networkText}>{toastText}</Text>
                </View>
            );
        }
        return component;
    }

    renderOnlineMessage = (position) => {
        const { onlineComponent, onlineText } = this.props;
        const { showOnline, previouslyOffline, onlineVisibility } = this.state;
        let component = onlineComponent;
        const toastText = onlineText ? onlineText : DEFAULT_ONLINE_TEXT;
        if (!onlineComponent) {
            component = (
                <View style={[styles.networkContainer, styles.onlineContainer, position]}>
                    <Text style={styles.networkText}>{toastText}</Text>
                </View>
            )
        }
        const showOnlineComponent = showOnline ? component : null;
        return previouslyOffline && onlineVisibility ? showOnlineComponent : null;
    }

    renderComponent = () => {
        const { isConnected, notificationPosition } = this.state;

        const position = notificationPosition === TOP_POSITION ? styles.topPosition : styles.bottomPosition;
        let content = isConnected ? this.renderOnlineMessage(position) : this.renderOfflineMessage(position);
        return content;
    }

    render() {
        return this.renderComponent();
    }
}