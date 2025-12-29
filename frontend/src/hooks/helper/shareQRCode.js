import Swal from "sweetalert2";


export const handleShareQR = async (event) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: `Here is my ticket QR for ${event.title}`,
        url: event.qrCode,
      });
    } else {
      // Fallback: copy link
      await navigator.clipboard.writeText(event.qrCode);
     Swal.fire({
  icon: "success",
  title: "Copied!",
  text: "QR link copied to clipboard",
  timer: 1500,
  showConfirmButton: false,
});;
    }
  } catch (err) {
    console.error("Share failed", err);
  }
};
