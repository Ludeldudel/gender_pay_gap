# Gender Pay Gap Deutschland - Demo Version 🔬

Eine interaktive Demo-Website zur Veranschaulichung der geschlechterbedingten Lohnlücke in Deutschland mit speziellen Demo-Features.

## 🎯 Demo-Features

Diese Demo-Version enthält zusätzliche Funktionen für Präsentations- und Demonstrationszwecke:

### 🔄 Auto-Scroll Funktionalität
- **Inaktivitäts-Timer**: Nach 1 Minute ohne Scroll-Aktivität springt die Demo automatisch zum Anfang zurück
- **Animierte Übergänge**: Schöne Overlay-Animation während des Auto-Scrolls
- **Visual Feedback**: Progress-Bar und Animationen zeigen den Auto-Scroll-Prozess

### ⏸️ Smart Counter Control
- **Verzögerter Start**: Der Live-Counter startet erst nach dem ersten Scroll-Event
- **Auto-Reset**: Counter wird zurückgesetzt wenn automatisch zum Anfang gescrollt wird
- **Visual State**: Pausierter Zustand wird deutlich angezeigt

### 👆 Scroll-Anleitung
- **Welcome Guide**: Animierte Scroll-Anleitung beim ersten Besuch
- **Mouse Animation**: Realistische Maus-Scroll-Animation
- **Smart Hiding**: Anleitung verschwindet nach erster Interaktion

### 🎮 Demo-Steuerung
- **Demo-Indikator**: Sichtbarer Demo-Status in der oberen rechten Ecke
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + D` - Auto-Scroll manuell auslösen
  - `Escape` - Aktionen abbrechen
  - `H` - Zum Anfang springen
  - `C` - Zum Rechner springen
  - `I` - Zur Branchenanalyse springen

## 🚀 Features der Basis-Anwendung

- **Live Counter**: Echtzeit-Darstellung der akkumulierten Lohnverluste
- **Interaktive Rechner**: Persönlicher Lohnlücken-Rechner
- **Datenvisualisierungen**: Charts und Grafiken zu verschiedenen Aspekten des Gender Pay Gap
- **Progressive Web App**: Installierbar als App auf allen Geräten
- **Responsive Design**: Optimiert für alle Bildschirmgrößen
- **Animationen**: Flüssige Übergänge und ansprechende Visualisierungen

## 🎨 Demo-spezifische Gestaltung

### Visual Indicators
- **Demo Badge**: Permanenter Indikator in der oberen rechten Ecke
- **Pausierte Zustände**: Grauer Counter-Zustand wenn nicht aktiv
- **Overlay-Animationen**: Schöne Übergänge für Auto-Scroll-Events

### Accessibility
- **Reduced Motion**: Respektiert prefers-reduced-motion für Barrierefreiheit
- **High Contrast**: Unterstützt High-Contrast-Modi
- **Keyboard Navigation**: Vollständige Tastatur-Unterstützung

## 💻 Technologie

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **PWA Features**: Service Worker, Web App Manifest
- **Styling**: CSS Custom Properties mit Dark Theme
- **Visualisierungen**: Canvas API für Charts
- **Demo Logic**: Event-basierte Scroll-Erkennung und Timer-Management

## 🔧 Verwendung

### Als Demo präsentieren
1. Website öffnen
2. Demo-Indikator bestätigt Demo-Modus
3. Ersten Scroll durchführen um Counter zu starten
4. 1 Minute warten um Auto-Scroll zu erleben
5. Ctrl/Cmd + D für manuellen Auto-Scroll

### Für Entwicklung
```bash
# Lokalen Server starten
python3 -m http.server 8000
# oder
npx serve .

# Demo öffnen
open http://localhost:8000
```

## 📱 PWA Installation

Die Demo kann als Progressive Web App installiert werden:
1. Website in Chrome/Edge/Safari öffnen
2. "Zur Startseite hinzufügen" oder Install-Button klicken
3. App wird wie native App installiert

## 🎮 Demo-Steuerung

| Aktion | Beschreibung |
|--------|-------------|
| **Erster Scroll** | Startet den Live-Counter |
| **1 Min Inaktivität** | Löst Auto-Scroll aus |
| **Ctrl/Cmd + D** | Manueller Auto-Scroll |
| **Escape** | Bricht Aktionen ab |
| **H, C, I** | Navigation zu Sektionen |

## 🔍 Demo-Unterschiede zur Hauptversion

| Feature | Hauptversion | Demo-Version |
|---------|-------------|-------------|
| **Counter Start** | Sofort | Nach erstem Scroll |
| **Auto-Scroll** | Nicht vorhanden | Nach 1 Min Inaktivität |
| **Scroll Guide** | Nicht vorhanden | Beim ersten Besuch |
| **Demo-Indikator** | Nicht vorhanden | Permanent sichtbar |
| **Reset-Funktion** | Nicht vorhanden | Bei Auto-Scroll |

## 📊 Datenquellen

Alle Daten stammen aus den gleichen offiziellen Quellen wie die Hauptversion:
- [Statistisches Bundesamt](https://www.destatis.de/DE/Themen/Arbeit/Verdienste/Verdienste-Verdienstunterschiede/_inhalt.html)
- [Eurostat](https://ec.europa.eu/eurostat/de/web/main/data/database)
- [Bundesministerium für Familie, Senioren, Frauen und Jugend](https://www.bmfsfj.de/bmfsfj/themen/gleichstellung/gleichstellung-und-teilhabe)

## ⚡ Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimiert für LCP, FID, CLS
- **Bundle Size**: ~100KB (ohne Bilder)
- **Load Time**: <2s auf 3G

## 🔒 Datenschutz & Hinweise

- **Keine Tracking**: Demo sammelt keine persönlichen Daten
- **Lokale Speicherung**: Nur für PWA-Funktionalität
- **Demo-Charakter**: Vereinfachte Berechnungen für Demonstrationszwecke
- **Bildungszweck**: Projekt zur Sensibilisierung für Gender Pay Gap

---

*Diese Demo-Version wurde speziell für Präsentationen und Demonstrationen der Gender Pay Gap Problematik entwickelt. Sie bietet eine interaktive und selbsterklärende Erfahrung mit automatischen Funktionen für unterbrechungsfreie Vorführungen.*

**🔬 Demo-Modus aktiv - Optimiert für Präsentationen und automatische Demonstrationen**
