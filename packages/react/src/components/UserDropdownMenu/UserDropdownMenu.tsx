/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {ListItemAvatar, ListSubheader, Radio} from '@mui/material';
import {capitalize} from '@mui/material/utils';
import clsx from 'clsx';
import {FC, MouseEvent, ReactElement, ReactNode, useState} from 'react';
import {WithWrapperProps} from 'src/models';
import {composeComponentDisplayName} from '../../utils';
import Avatar from '../Avatar';
import Button, {ButtonProps} from '../Button';
import Divider from '../Divider';
import ListItem from '../ListItem';
import ListItemIcon from '../ListItemIcon';
import ListItemText from '../ListItemText';
import Menu, {MenuProps} from '../Menu';
import MenuItem from '../MenuItem';
import './user-dropdown-menu.scss';

/**
 * Interface for the Button Dropdown Menu component props.
 */
export interface UserDropdownMenuProps extends Omit<MenuProps, 'open' | 'anchorEl'> {
  /**
   * List item icon.
   */
  actionIcon?: ReactNode;
  /**
   * List item button text.
   */
  actionText?: string;
  /**
   * Current mode.
   */
  mode?: string;
  /**
   * Array list of modes
   */
  modes?: ModeListInterface[];
  /**
   * Heading of the modes list.
   */
  modesHeading?: string;
  /**
   * Callback function on list item action trigger.
   */
  onActionTrigger?: () => void;
  /**
   * Callback function on mode change.
   */
  onModeChange?: (mode: string) => void;
  /**
   * Callback function on navigation to logged user's profile.
   */
  onUserProfileNavigation?: () => void;
  /**
   * Props sent to the menu trigger or Button component;
   */
  triggerOptions?: Omit<ButtonProps, 'onClick'>;
  /**
   * Logged user information.
   */
  user?: UserTemplate;
}

export interface ModeListInterface {
  /**
   * Icon of the mode.
   */
  icon?: string | ReactElement;
  /**
   * Display name of the mode.
   */
  name: string;
}

export interface UserTemplate {
  /**
   * Email of logged user.
   */
  email?: string;
  /**
   * Image link of logged user.
   */
  image?: string;
  /**
   * Display name of logged user.
   */
  name?: string;
}

const COMPONENT_NAME: string = 'UserDropdownMenu';

const UserDropdownMenu: FC<UserDropdownMenuProps> & WithWrapperProps = (
  props: UserDropdownMenuProps & WithWrapperProps,
) => {
  const {
    className,
    children,
    triggerOptions,
    user,
    modes,
    mode,
    onUserProfileNavigation,
    modesHeading,
    actionText,
    actionIcon,
    onModeChange,
    onActionTrigger,
    ...rest
  } = props;

  const classes: string = clsx('oxygen-user-dropdown-menu', className);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu: boolean = Boolean(anchorEl);

  const handleModeChange = (selectedMode: string): void => {
    onModeChange(selectedMode);
  };

  const onCloseMenu = (): void => {
    setAnchorEl(null);
  };

  const handleUserProfileNavigation = (): void => {
    onCloseMenu();
    if (onUserProfileNavigation) {
      onUserProfileNavigation();
    }
  };

  const handleActionTrigger = (): void => {
    onCloseMenu();
    if (onActionTrigger) {
      onActionTrigger();
    }
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button
        aria-controls={openMenu ? 'oxygen-button-menu' : undefined}
        aria-haspopup="true"
        onClick={handleOpenUserMenu}
        {...triggerOptions}
      />
      <Menu
        open={openMenu}
        anchorEl={anchorEl}
        className={classes}
        id="oxygen-button-menu"
        onClose={onCloseMenu}
        {...rest}
      >
        {children}
        {user && (
          <ListItem
            className={clsx('dropdown-list-item', {
              clickable: onUserProfileNavigation,
            })}
            onClick={(): void => handleUserProfileNavigation()}
          >
            <ListItemAvatar>
              <Avatar src={user?.image} alt="User" />
            </ListItemAvatar>
            <ListItemText primary={user?.name} secondary={user?.email} />
          </ListItem>
        )}
        {modes?.length > 0 && (
          <>
            <Divider />
            <ListSubheader>{modesHeading}</ListSubheader>
            {modes?.map((theme: ModeListInterface) => {
              const {name, icon} = theme;
              return (
                <MenuItem className="dropdown-menu-item" key={name} onClick={(): void => handleModeChange(name)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={capitalize(name)} />
                  <Radio
                    edge="end"
                    checked={mode === name}
                    onChange={(): void => handleModeChange(name)}
                    value={name}
                    name="radio-buttons"
                    inputProps={{'aria-label': `mode-label-${name}`}}
                  />
                </MenuItem>
              );
            })}
          </>
        )}
        {actionText && (
          <>
            <Divider />
            <MenuItem className="dropdown-menu-item" onClick={(): void => handleActionTrigger()}>
              <ListItemIcon>{actionIcon}</ListItemIcon>
              <ListItemText primary={actionText} />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

UserDropdownMenu.displayName = composeComponentDisplayName(COMPONENT_NAME);
UserDropdownMenu.muiName = COMPONENT_NAME;

export default UserDropdownMenu;
