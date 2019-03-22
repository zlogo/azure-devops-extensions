import { useActionCreators } from "Common/Hooks/useActionCreators";
import { useMappedState } from "Common/Hooks/useMappedState";
import { BugBashDirectoryActions, BugBashDirectoryTabId, getBugBashDirectorySelectedTab, IBugBashDirectoryAwareState } from "../Redux";

export function useBugBashesSelectedTab(): IUseBugBashesSelectedTabHookMappedState & typeof Actions {
    const { selectedTab } = useMappedState(mapState);
    const { setSelectedTab } = useActionCreators(Actions);

    return { selectedTab, setSelectedTab };
}

const Actions = {
    setSelectedTab: BugBashDirectoryActions.selectTab
};

function mapState(state: IBugBashDirectoryAwareState): IUseBugBashesSelectedTabHookMappedState {
    return {
        selectedTab: getBugBashDirectorySelectedTab(state)
    };
}

interface IUseBugBashesSelectedTabHookMappedState {
    selectedTab: BugBashDirectoryTabId;
}
