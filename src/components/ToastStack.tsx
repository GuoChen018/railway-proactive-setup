import { BellIcon, CheckIcon, CloseIcon } from "./icons";
import { REPO } from "../flow/flow";
import "./ToastStack.css";

interface Props {
  showSetup: boolean;
  showLive: boolean;
  notificationsEnabled: boolean;
  onEnableNotifications: () => void;
  onDismissSetup: () => void;
  onDismissLive: () => void;
}

export function ToastStack({
  showSetup,
  showLive,
  notificationsEnabled,
  onEnableNotifications,
  onDismissSetup,
  onDismissLive,
}: Props) {
  return (
    <div className="toast-stack">
      {showSetup && (
        <div className="toast">
          <div className="toast-content">
            <div className="toast-title">Get notified when complete</div>
            <div className="toast-body">
              This can take a few minutes. Turn on browser notifications to know
              the moment it's ready.
            </div>
            <button
              className={`toast-action ${notificationsEnabled ? "done" : ""}`}
              onClick={onEnableNotifications}
              disabled={notificationsEnabled}
            >
              {notificationsEnabled ? (
                <>
                  <CheckIcon size={14} />
                  Notifications on
                </>
              ) : (
                <>
                  <BellIcon size={14} />
                  Enable notifications
                </>
              )}
            </button>
          </div>
          <button className="toast-close" onClick={onDismissSetup} aria-label="Dismiss">
            <CloseIcon size={15} />
          </button>
        </div>
      )}

      {showLive && <LiveToast onDismiss={onDismissLive} />}
    </div>
  );
}

function LiveToast({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="toast toast-live">
      <span className="toast-icon live">
        <span className="toast-live-dot" />
      </span>
      <div className="toast-content">
        <div className="toast-title">Your app is live</div>
        <a
          className="toast-link"
          href={`https://${REPO.liveUrl}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.preventDefault()}
        >
          {REPO.liveUrl}
        </a>
      </div>
      <button className="toast-close" onClick={onDismiss} aria-label="Dismiss">
        <CloseIcon size={15} />
      </button>
    </div>
  );
}
