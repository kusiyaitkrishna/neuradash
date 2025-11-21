# Neuraguard Dashboard 🛡️

![Neuraguard Dashboard](https://via.placeholder.com/1200x600/020817/F8FAFC?text=Neuraguard+Dashboard+Preview)

**Neuraguard** is a next-generation security command center designed for real-time digital footprint monitoring, threat intelligence, and vulnerability scanning. Built with a "Midnight Pro" aesthetic, it offers a high-performance control plane for security professionals.

## 🚀 Features

### 🎨 Midnight Pro Design System
- **Deep Midnight Theme**: Calibrated `#020817` background for reduced eye strain and professional focus.
- **Glassmorphism UI**: Sophisticated glass panels with `backdrop-blur-xl` for depth and hierarchy.
- **High-Density Data**: Optimized layouts to present critical security metrics without clutter.
- **Fluid Animations**: Smooth, hardware-accelerated transitions powered by `framer-motion`.

### 🛡️ Core Capabilities
- **Real-time Monitoring**: Live system status, uptime tracking, and active scan metrics.
- **Threat Intelligence**: Visual breakdown of threats by severity (Critical, High, Medium, Low).
- **Identity Protection**: Monitor and manage digital identities across the web.
- **Advanced Scanning**:
  - **Crawl Results**: Detailed view of crawled URLs with status codes and response times.
  - **Threat Detection**: Automated pattern matching for malware, phishing, and vulnerabilities.
- **Analytics Engine**: Comprehensive charts and graphs visualizing security posture over time.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Custom UI library based on [Radix UI](https://www.radix-ui.com/) primitives.
- **HTTP Client**: Axios with interceptors for secure authentication.

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/kusiyaitkrishna/neuradash.git
    cd neuradash
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the dashboard**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Authentication routes (login, register)
│   ├── (dashboard)/     # Protected dashboard routes
│   └── globals.css      # Global styles & Tailwind theme
├── components/
│   ├── layout/          # Sidebar, Header, Layout wrappers
│   ├── scans/           # Scan-specific components (CrawlResults, ScanThreats)
│   └── ui/              # Reusable UI components (Button, Card, Input, etc.)
├── lib/
│   ├── auth/            # Auth store & API interceptors
│   └── utils.ts         # Helper functions
└── types/               # TypeScript definitions
```

## 🔌 API Integration

The dashboard connects to the Neuraguard Backend API for live data. Key endpoints include:

- `/dashboard/overview`: System health and summary metrics.
- `/scan/start`: Initiate new security scans.
- `/scan/crawl-results/{id}`: Retrieve detailed crawl data.
- `/scan/threats/{id}`: Fetch detected security threats.
- `/monitoring/identities`: Manage monitored entities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for the Security Community.*
