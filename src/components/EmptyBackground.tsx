import emptyBg from "../assets/empty-bg.png";
import "./EmptyBackground.css";

// Railway's empty-project backdrop: a deep navy field with Railway's snowy
// mountain illustration. The illustration PNG is very dark, so we blend it with
// `screen` over a navy base — the dark sky drops out and the lighter mountains
// + dot texture read clearly without the whole thing looking black.
export function EmptyBackground() {
  return (
    <div className="empty-bg">
      <img className="empty-bg-illustration" src={emptyBg} alt="" />
      <div className="empty-bg-vignette" />
    </div>
  );
}
