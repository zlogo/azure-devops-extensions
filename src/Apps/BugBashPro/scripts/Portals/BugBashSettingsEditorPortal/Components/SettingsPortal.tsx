import { BugBashSettingsEditorPanel } from "BugBashPro/Editors/BugBashSettingsEditor";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import * as React from "react";
import { BugBashSettingsPortalActions, IBugBashSettingsPortalAwareState, isSettingsPortalOpen } from "../Redux";

interface ISettingsPortalStateProps {
    panelOpen: boolean;
}

function mapStateToProps(state: IBugBashSettingsPortalAwareState): ISettingsPortalStateProps {
    return {
        panelOpen: isSettingsPortalOpen(state)
    };
}

const Actions = {
    dismissPortal: BugBashSettingsPortalActions.dismissPortal
};

export function SettingsPortal() {
    const { panelOpen } = useMappedState(mapStateToProps);
    const { dismissPortal } = useActionCreators(Actions);

    if (!panelOpen) {
        return null;
    }

    return <BugBashSettingsEditorPanel onDismiss={dismissPortal} />;
}