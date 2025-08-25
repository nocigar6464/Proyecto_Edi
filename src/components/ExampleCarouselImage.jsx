export default function ExampleCarouselImage({
  src,
  alt = "Slide",
  height = 420,
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: "600px", objectFit: "cover" }}
    />
  );
}
