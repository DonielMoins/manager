import React, { Fragment } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EllipsisIcon, TileSection } from '@ovh-ux/manager-themes';

import { useShell, OvhContextShellType } from '@/core';

import { DashboardTileDefinition, DashboardTileDefinitionAction } from '.';

export type DashboardTileListProps = {
  definitions: DashboardTileDefinition[];
  data: unknown;
};

export default function DashboardTileList({
  definitions,
  data,
}: DashboardTileListProps): JSX.Element {
  const shell = useShell();

  const getActionList = (actions: DashboardTileDefinitionAction[], shell: OvhContextShellType) => {
    if (!actions?.length) {
      return '';
    }

    const getMenuItem = (action: DashboardTileDefinitionAction) => {
      if (Object.prototype.hasOwnProperty.call(action, 'to')) {
        return (
          <MenuItem
            key={action.label}
            as={RouterLink}
            to={action.to}
            aria-label={action.title || action.label}
          >
            {action.label}
          </MenuItem>
        );
      }

      if (Object.prototype.hasOwnProperty.call(action, 'href')) {
        return (
          <MenuItem
            key={action.label}
            as={Link}
            href={action.href}
            isExternal={action.isExternal}
            aria-label={action.title || action.label}
            onClick={action.onClick || action.trackAction ? () => {
              if (action.onClick) {
                action.onClick();
              }
              if (action.trackAction) {
                shell.tracking.trackClick({
                  type: 'action',
                  name: action.trackAction,
                  customVars: undefined,
                })
              }
            } : undefined }
          >
            {action.label}
          </MenuItem>
        );
      }

      return (
        <MenuItem
          key={action.label}
          aria-label={action.title || action.label}
          onClick={action?.onClick.bind(null, data)}
        >
          {action.label}
        </MenuItem>
      );
    };

    return (
      <Menu>
        <MenuButton
          as={IconButton}
          isRound
          variant="outline"
          icon={<EllipsisIcon />}
        />
        <MenuList>
          {actions.map((action: DashboardTileDefinitionAction) => (
            <Fragment key={action.name}>{getMenuItem(action)}</Fragment>
          ))}
        </MenuList>
      </Menu>
    );
  };

  return (
    <>
      {definitions?.map((definition: DashboardTileDefinition) => {
        return (
          typeof definition.hidden === 'function'
          ? definition.hidden(data)
          : definition?.hidden || ''
        ) ? null : (
          <TileSection
            key={definition.name}
            title={definition.title}
            description={
              typeof definition.description === 'function'
                ? definition.description(data)
                : definition?.description || ''
            }
            action={getActionList(
              typeof definition.actions === 'function'
                ? definition.actions(data)
                : definition.actions || [],
              shell)
            }
          ></TileSection>
        );
      })}
    </>
  );
}
