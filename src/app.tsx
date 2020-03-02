import {hot, Window} from "@nodegui/react-nodegui";
import React, {MutableRefObject, useCallback, useEffect, useRef} from "react";
import {QIcon, QMainWindow, QStatusBar, WidgetEventTypes} from "@nodegui/nodegui";

import {ConnectionStatus as ConnectionStatusType} from "mysterium-vpn-js"
import mystLogo from "../assets/logo.svg";
import {useStores} from "./store";
import {autorun} from "mobx";
import {DaemonStatusType} from "./daemon/store";
import {winSize} from "./config";
import {ConnectView} from "./connect-view";

const winIcon = new QIcon(mystLogo);

const mainWindowEventHandler = {
    [WidgetEventTypes.Close]: () => {
        process.emit("beforeExit", 0)
    }
}

const statusBar = new QStatusBar()

const App = () => {
    var winRef: MutableRefObject<QMainWindow | null> = useRef<QMainWindow>(null);
    const setRef = useCallback((ref: QMainWindow) => {
        if (ref !== null) {
            ref.setStatusBar(statusBar)
        }
        winRef.current = ref
    }, [])
    const {daemon, connection, identity} = useStores();
    useEffect(() => autorun(() => {
        const daemonIcon = (daemon.status == DaemonStatusType.Up) ? '🟢' : '⚪️'
        const connectionIcon = (connection.status == ConnectionStatusType.CONNECTED) ? '🟢' : '⚪️'
        statusBar.showMessage(`Connection: ${connectionIcon} | Daemon: ${daemonIcon} | ID: ${identity.id || '⚪'}`, 0)
    }))

    return (
        <Window
            ref={setRef}
            on={mainWindowEventHandler}
            windowIcon={winIcon}
            windowTitle="Mysterium VPN 2"
            minSize={winSize}
            maxSize={winSize}
        >
            <ConnectView/>
        </Window>
    )
}

export default hot(App);
