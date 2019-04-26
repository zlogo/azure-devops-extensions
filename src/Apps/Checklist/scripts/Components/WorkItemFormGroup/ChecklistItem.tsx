import "./ChecklistItem.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { Icon } from "azure-devops-ui/Icon";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { WorkItemChecklistContext } from "Checklist/Constants";
import { ChecklistItemState, IChecklistItem } from "Checklist/Interfaces";
import { WorkItemChecklistActions } from "Checklist/Redux/WorkItemChecklist/Actions";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";

interface IChecklistItemProps {
    checklistItem: IChecklistItem;
    disabled?: boolean;
    className?: string;
}

const Actions = {
    deleteChecklistItem: WorkItemChecklistActions.workItemChecklistItemDeleteRequested,
    updateChecklistItem: WorkItemChecklistActions.workItemChecklistItemUpdateRequested
};

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem, className, disabled } = props;
    const workItemId = React.useContext(WorkItemChecklistContext);
    const { deleteChecklistItem, updateChecklistItem } = useActionCreators(Actions);
    const isCompleted = checklistItem.state === ChecklistItemState.Completed;

    const onItemClick = React.useCallback(() => {
        updateChecklistItem(workItemId, { ...checklistItem, state: isCompleted ? ChecklistItemState.New : ChecklistItemState.Completed });
    }, [workItemId, isCompleted, checklistItem]);

    const onCheckboxChange = React.useCallback(
        (e: React.FormEvent<HTMLElement | HTMLInputElement>, checked: boolean) => {
            e.stopPropagation();
            updateChecklistItem(workItemId, { ...checklistItem, state: checked ? ChecklistItemState.Completed : ChecklistItemState.New });
        },
        [workItemId, checklistItem]
    );

    const onDeleteClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            deleteChecklistItem(workItemId, checklistItem.id);
        },
        [checklistItem.id]
    );

    const onEditClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            console.log("edit");
        },
        [workItemId, isCompleted, checklistItem]
    );

    return (
        <div className={css("checklist-item-container scroll-hidden flex-row flex-center", className, isCompleted && "completed")}>
            <Icon className="drag-handle flex-noshrink" iconName="Cancel" />
            <div className="checklist-item scroll-hidden flex-row flex-center flex-grow" onClick={onItemClick}>
                <Checkbox className="flex-noshrink" disabled={disabled} checked={isCompleted} onChange={onCheckboxChange} />
                {checklistItem.required && <div className="required-item">*</div>}
                <Tooltip overflowOnly={true} text={checklistItem.text}>
                    <div className="checklist-item-text flex-grow text-ellipsis">{checklistItem.text}</div>
                </Tooltip>
                <div className="flex-noshrink checklist-commandbar">
                    <Button
                        disabled={disabled}
                        subtle={true}
                        onClick={onEditClick}
                        className="checklist-command-item "
                        iconProps={{ iconName: "Edit" }}
                        tooltipProps={{ text: "Edit" }}
                    />
                    <Button
                        subtle={true}
                        disabled={disabled}
                        onClick={onDeleteClick}
                        className="checklist-command-item error-item"
                        iconProps={{ iconName: "Delete" }}
                        tooltipProps={{ text: "Delete" }}
                    />
                </div>
            </div>
        </div>
    );
}
