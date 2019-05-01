import "./ChecklistItem.scss";

import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { Icon } from "azure-devops-ui/Icon";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { css } from "azure-devops-ui/Util";
import { LoadStatus } from "Common/Contracts";
import { useActionCreators } from "Common/Hooks/useActionCreators";
import * as React from "react";
import { ChecklistContext } from "../../Constants";
import { useChecklistStatus } from "../../Hooks/useChecklistStatus";
import { ChecklistItemState, ChecklistType, IChecklistItem } from "../../Interfaces";
import { ChecklistActions } from "../../Redux/Actions";
import { IBaseProps, IChecklistItemCommonProps } from "../Props";

interface IChecklistItemProps extends IBaseProps, IChecklistItemCommonProps {
    checklistItem: IChecklistItem;
    checklistType: ChecklistType;
}

const Actions = {
    deleteChecklistItem: ChecklistActions.checklistItemDeleteRequested,
    updateChecklistItem: ChecklistActions.checklistItemUpdateRequested
};

export function ChecklistItem(props: IChecklistItemProps) {
    const { checklistItem, checklistType, className, canDeleteItem, canEditItem, canUpdateItemState } = props;
    const idOrType = React.useContext(ChecklistContext);
    const { deleteChecklistItem, updateChecklistItem } = useActionCreators(Actions);
    const status = useChecklistStatus(idOrType);

    const isCompleted = checklistItem.state === ChecklistItemState.Completed;
    const disabled = status !== LoadStatus.Ready;

    const onItemClick = React.useCallback(() => {
        if (!disabled && canUpdateItemState) {
            updateChecklistItem(
                idOrType,
                { ...checklistItem, state: isCompleted ? ChecklistItemState.New : ChecklistItemState.Completed },
                checklistType
            );
        }
    }, [canUpdateItemState, idOrType, disabled, isCompleted, checklistItem, checklistType]);

    const onCheckboxChange = React.useCallback(
        (e: React.FormEvent<HTMLElement | HTMLInputElement>, checked: boolean) => {
            if (!disabled && canUpdateItemState) {
                e.stopPropagation();
                updateChecklistItem(
                    idOrType,
                    { ...checklistItem, state: checked ? ChecklistItemState.Completed : ChecklistItemState.New },
                    checklistType
                );
            }
        },
        [canUpdateItemState, disabled, idOrType, checklistItem, checklistType]
    );

    const onDeleteClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!disabled && canDeleteItem) {
                e.stopPropagation();
                deleteChecklistItem(idOrType, checklistItem.id, checklistType);
            }
        },
        [disabled, canDeleteItem, idOrType, checklistItem.id, checklistType]
    );

    const onEditClick = React.useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!disabled && canEditItem) {
                e.stopPropagation();
                console.log("edit");
            }
        },
        [disabled, canEditItem, idOrType, checklistItem.id, checklistType]
    );

    return (
        <div className={css("checklist-item-container scroll-hidden flex-row flex-center", className, isCompleted && "completed")}>
            <Icon className="drag-handle flex-noshrink" iconName="Cancel" />
            <div className="checklist-item scroll-hidden flex-row flex-center flex-grow" onClick={canUpdateItemState ? onItemClick : undefined}>
                {canUpdateItemState && <Checkbox className="flex-noshrink" disabled={disabled} checked={isCompleted} onChange={onCheckboxChange} />}
                {checklistItem.required && <div className="required-item">*</div>}
                <Tooltip overflowOnly={true} text={checklistItem.text}>
                    <div className="checklist-item-text flex-grow text-ellipsis">{checklistItem.text}</div>
                </Tooltip>
                <div className="flex-noshrink checklist-commandbar">
                    {!canEditItem && !canDeleteItem && (
                        <Button
                            subtle={true}
                            className="checklist-command-item"
                            iconProps={{ iconName: "Info" }}
                            tooltipProps={{
                                text:
                                    "This is a default item. To update or delete it, please go to the settings page by clicking the gear icon above."
                            }}
                        />
                    )}
                    {canEditItem && (
                        <Button
                            disabled={disabled}
                            subtle={true}
                            onClick={onEditClick}
                            className="checklist-command-item"
                            iconProps={{ iconName: "Edit" }}
                            tooltipProps={{ text: "Edit" }}
                        />
                    )}
                    {canDeleteItem && (
                        <Button
                            subtle={true}
                            disabled={disabled}
                            onClick={onDeleteClick}
                            className="checklist-command-item error-item"
                            iconProps={{ iconName: "Delete" }}
                            tooltipProps={{ text: "Delete" }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
