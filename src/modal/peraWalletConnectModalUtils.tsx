import PeraWalletLogoCircleYellow from "../asset/icon/PeraWallet--circle-yellow.svg";
import QrIcon from "../asset/icon/Qr.svg";

import React from "react";
import ReactDOM from "react-dom/client";
import {QRCode} from "react-qrcode-logo";

import {AccordionData} from "./component/accordion/util/accordionTypes";
import PeraWalletConnectError from "../util/PeraWalletConnectError";
import PeraWalletConnectModal from "./PeraWalletConnectModal";
import PeraWalletRedirectModal from "./redirect/PeraWalletRedirectModal";
import PeraWalletSignTxnToast from "./sign-toast/PeraWalletSignTxnToast";

// The ID of the wrapper element for PeraWalletConnectModal
const PERA_WALLET_CONNECT_MODAL_ID = "pera-wallet-connect-modal-wrapper";

// The ID of the wrapper element for PeraWalletRedirectModal
const PERA_WALLET_REDIRECT_MODAL_ID = "pera-wallet-redirect-modal-wrapper";

// The ID of the wrapper element for PeraWalletSignTxnToast
const PERA_WALLET_SIGN_TXN_TOAST_ID = "pera-wallet-sign-txn-toast-wrapper";

/**
 * @returns {HTMLDivElement} wrapper element for PeraWalletConnectModal
 */
function createModalWrapperOnDOM(modalId: string) {
  const wrapper = document.createElement("div");

  wrapper.setAttribute("id", modalId);

  document.body.appendChild(wrapper);

  return wrapper;
}

/**
 * Creates a PeraWalletConnectModal instance and renders it on the DOM.
 *
 * @param {rejectPromise} rejectPromise - the reject callback of the PeraWalletConnect.connect method
 * @param {string} uri - uri to be passed to Pera Wallet via deeplink
 * @param {VoidFunction} closeCallback - callback to be called when user closes the modal
 * @returns {void}
 */
function openPeraWalletConnectModal(
  onWebWalletConnect: VoidFunction,
  rejectPromise?: (error: any) => void
) {
  return (uri: string, closeCallback: VoidFunction) => {
    const root = ReactDOM.createRoot(
      createModalWrapperOnDOM(PERA_WALLET_CONNECT_MODAL_ID)
    );

    root.render(
      <PeraWalletConnectModal
        onClose={handleClosePeraWalletConnectModal}
        onWebWalletConnect={onWebWalletConnect}
        uri={uri}
      />
    );

    function handleClosePeraWalletConnectModal() {
      removeModalWrapperFromDOM(PERA_WALLET_CONNECT_MODAL_ID);
      closeCallback();

      if (rejectPromise) {
        rejectPromise(
          new PeraWalletConnectError(
            {
              type: "CONNECT_MODAL_CLOSED"
            },
            "The modal has been closed by the user."
          )
        );
      }
    }
  };
}

/**
 * Creates a PeraWalletRedirectModal instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openPeraWalletRedirectModal() {
  const root = ReactDOM.createRoot(
    createModalWrapperOnDOM(PERA_WALLET_REDIRECT_MODAL_ID)
  );

  root.render(<PeraWalletRedirectModal onClose={handleClosePeraWalletRedirectModal} />);

  function handleClosePeraWalletRedirectModal() {
    removeModalWrapperFromDOM(PERA_WALLET_REDIRECT_MODAL_ID);
  }
}

/**
 * Creates a PeraWalletSignTxnToast instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openPeraWalletSignTxnToast() {
  const root = ReactDOM.createRoot(
    createModalWrapperOnDOM(PERA_WALLET_SIGN_TXN_TOAST_ID)
  );

  root.render(<PeraWalletSignTxnToast onClose={closePeraWalletSignTxnToast} />);
}

function closePeraWalletSignTxnToast() {
  removeModalWrapperFromDOM(PERA_WALLET_SIGN_TXN_TOAST_ID);
}

/**
 * Removes the PeraWalletConnectModal from the DOM.
 * @returns {void}
 */
function removeModalWrapperFromDOM(modalId: string) {
  const wrapper = document.getElementById(modalId);

  if (wrapper) {
    wrapper.remove();
  }
}

interface PeraWalletConnectModalAccordionProps {
  uri: string;
  handleSetView: VoidFunction;
}

function getPeraConnectModalAccordionData({
  uri,
  handleSetView
}: PeraWalletConnectModalAccordionProps): AccordionData[] {
  return [
    {
      id: "web-wallet",
      title: (
        <div className={"pera-wallet-accordion-button__content-with-label"}>
          <div>
            {"Connect with"}

            <span className={"pera-wallet-accordion-button__bold-color"}>
              {" Pera Web"}
            </span>
          </div>

          <span className={"pera-wallet-accordion-button__label"}>{"NEW"}</span>
        </div>
      ),
      description: (
        <div className={"pera-wallet-connect-modal-desktop-mode__web-wallet"} />
      )
    },
    {
      id: "scan-to-connect",
      title: (
        <>
          {"Connect with"}

          <span className={"pera-wallet-accordion-button__bold-color"}>
            {" Pera Mobile"}
          </span>
        </>
      ),
      description: (
        <>
          <QRCode
            id={"pera-wallet-connect-modal-desktop-mode__qr-code"}
            logoImage={PeraWalletLogoCircleYellow}
            value={uri}
            qrStyle={"dots"}
            size={190}
            quietZone={10}
            logoWidth={64}
            logoHeight={64}
            // eslint-disable no-magic-numbers
            eyeRadius={5}
          />

          <div>
            <p
              className={
                "pera-wallet-connect-modal-desktop-mode__download-pera-description"
              }>
              {"Don’t have Pera Wallet app?"}
            </p>

            <button
              className={"pera-wallet-connect-modal-desktop-mode__download-pera-button"}
              onClick={handleSetView}>
              <img src={QrIcon} alt={"QR Icon"} />

              {"Download Pera Wallet"}
            </button>
          </div>
        </>
      )
    }
  ];
}

export {getPeraConnectModalAccordionData};

export {
  PERA_WALLET_CONNECT_MODAL_ID,
  PERA_WALLET_REDIRECT_MODAL_ID,
  PERA_WALLET_SIGN_TXN_TOAST_ID,
  openPeraWalletConnectModal,
  openPeraWalletRedirectModal,
  openPeraWalletSignTxnToast,
  closePeraWalletSignTxnToast,
  removeModalWrapperFromDOM
};
