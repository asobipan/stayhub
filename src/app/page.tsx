export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1
        className="text-5xl md:text-6xl text-foreground mb-4 leading-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Знайди своє ідеальне місце
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl">
        Тисячі унікальних помешкань по всій Україні та світу. Бронюй легко, живи комфортно.
      </p>
    </div>
  );
}
