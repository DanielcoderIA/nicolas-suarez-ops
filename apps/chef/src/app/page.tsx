export default function HomePage() {
  return (
    <main>
      <section
        style={{
          backgroundColor: "var(--chef-bg)",
          padding: "64px 24px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Kicker */}
        <span
          style={{
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "var(--chef-accent)",
            marginBottom: "20px",
          }}
        >
          Chef Ejecutivo · Zipaquirá
        </span>

        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
            fontSize: "42px",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--chef-text)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          Nicolás Suárez
        </h1>

        {/* Separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "24px 0",
          }}
        >
          <span
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "rgba(141, 106, 50, 0.3)",
              display: "block",
            }}
          />
          <span
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "rgba(141, 106, 50, 0.4)",
              transform: "rotate(45deg)",
              borderRadius: "1px",
              display: "block",
            }}
          />
          <span
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "rgba(141, 106, 50, 0.3)",
              display: "block",
            }}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontSize: "14px",
            color: "var(--chef-text2)",
            maxWidth: "400px",
            lineHeight: 1.7,
          }}
        >
          Cocina colombiana de autor. Tres restaurantes, una visión.
        </p>
      </section>
    </main>
  );
}
