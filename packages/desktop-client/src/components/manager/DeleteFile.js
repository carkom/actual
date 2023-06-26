import React, { useState } from 'react';

import { colorsm } from '../../style';
import { View, Text, Modal, ButtonWithLoading } from '../common';

export default function DeleteMenu({ modalProps, actions, file }) {
  let [loadingState, setLoadingState] = useState(null);

  async function onDeleteCloud() {
    setLoadingState('cloud');
    await actions.deleteBudget(file.id, file.cloudFileId);
    setLoadingState(null);

    modalProps.onBack();
  }

  async function onDeleteLocal() {
    setLoadingState('local');
    await actions.deleteBudget(file.id);
    setLoadingState(null);

    modalProps.onBack();
  }

  // If the state is "broken" that means it was created by another
  // user. The current user should be able to delete the local file,
  // but not the remote one
  let isRemote = file.cloudFileId && file.state !== 'broken';

  return (
    <Modal
      {...modalProps}
      title={'Delete ' + file.name}
      padding={0}
      showOverlay={false}
      onClose={modalProps.onBack}
    >
      {() => (
        <View
          style={{
            padding: 15,
            gap: 15,
            paddingTop: 0,
            paddingBottom: 25,
            maxWidth: 512,
            lineHeight: '1.5em',
            color: colorsm.tableText,
          }}
        >
          {isRemote && (
            <>
              <Text>
                This is a <strong>hosted file</strong> which means it is stored
                on your server to make it available for download on any device.
                You can delete it from the server, which will also remove it
                from all of your devices.
              </Text>

              <ButtonWithLoading
                primary
                loading={loadingState === 'cloud'}
                style={{
                  backgroundColor: colorsm.tableText,
                  alignSelf: 'center',
                  border: 0,
                  padding: '10px 30px',
                  fontSize: 14,
                }}
                onClick={onDeleteCloud}
              >
                Delete file from all devices
              </ButtonWithLoading>
            </>
          )}

          {file.id && (
            <>
              <Text
                style={[
                  isRemote && { marginTop: 20, color: colorsm.tableText },
                ]}
              >
              {isRemote ? (
                <Text>
                  You can also delete just the local copy. This will remove all
                  local data and the file will be listed as available for
                  download.
                </Text>
              ) : (
                <Text>
                  {file.state === 'broken' ? (
                    <>
                      This is a <strong>hosted file</strong> but it was created
                      by another user. You can only delete the local copy.
                    </>
                  ) : (
                    <>
                      This a <strong>local file</strong> which is not stored on
                      a server.
                    </>
                  )}{' '}
                  Deleting it will remove it and all of its backups permanently.
                </Text>
              )}

              <ButtonWithLoading
                primary={!isRemote}
                loading={loadingState === 'local'}
                style={[
                  {
                    alignSelf: 'center',
                    marginTop: 10,
                    padding: '10px 30px',
                    fontSize: 14,
                  },
                  isRemote
                    ? {
                        borderColor: colorsm.errorAccent,
                        color: colorsm.errorBackground,
                        backgroundColor: colorsm.errorText,
                      }
                    : {
                        border: 0,
                        color: colorsm.errorBackground,
                        backgroundColor: colorsm.errorText,
                      },
                ]}
                onClick={onDeleteLocal}
              >
                Delete file locally
              </ButtonWithLoading>
            </>
          )}
        </View>
      )}
    </Modal>
  );
}
