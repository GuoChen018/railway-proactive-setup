import { RailwayMark } from "./icons";
import { REPO } from "../flow/flow";
import "./OSNotification.css";

export function OSNotification({ onDone }: { onDone: () => void }) {
  return (
    <div className="os-notif" onAnimationEnd={(e) => {
      if (e.animationName === "os-out") onDone();
    }}>
      <div className="os-notif-app">
        <span className="os-notif-icon">
          <RailwayMark size={18} />
        </span>
        <span className="os-notif-appname">Railway</span>
        <span className="os-notif-now">now</span>
      </div>
      <div className="os-notif-title">Your app is live</div>
      <div className="os-notif-body">{REPO.liveUrl}</div>
    </div>
  );
}
