<!-- TODO: Root-Layout der gesamten App.
     Importiert app.css (Tailwind), rendert Navbar oben, Sidebar links, <slot /> rechts.
     Prüft bei jedem Route-Wechsel ob JWT vorhanden, leitet bei fehlender Auth zu /auth um.
     Initialisiert WebSocket-Verbindung und globalen $state. -->
<script>
  import '../app.css';
</script>
