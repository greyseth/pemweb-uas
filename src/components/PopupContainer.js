import "../assets/css/components/global_popup.css";

export default function PopupContainer({ children, zIndex }) {
  return (
    <section className="popup-container" style={{ zIndex: zIndex ?? 100 }}>
      {children}
    </section>
  );
}
