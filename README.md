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

## 🤝 Contribution Guidelines

We welcome contributions to Neuraguard! To ensure a smooth workflow and maintain code quality, please follow these guidelines when working on new features or bug fixes.

### Branching Strategy
**Never push directly to the `main` branch.** All changes must go through a Pull Request (PR).

1.  **Create a Feature Branch**:
    Always create a separate branch for your work. Use descriptive names that indicate the type of work (feature, bugfix, hotfix) and the specific task.
    ```bash
    # For new features
    git checkout -b feature/add-new-chart

    # For bug fixes
    git checkout -b bugfix/fix-login-error

    # For documentation updates
    git checkout -b docs/update-readme
    ```

2.  **Commit Messages**:
    Write clear, concise commit messages that explain *what* changed and *why*.
    ```bash
    git commit -m "feat: add real-time threat graph to dashboard"
    ```

3.  **Push and Open a PR**:
    Push your branch to the repository and open a Pull Request against `main`.
    ```bash
    git push origin feature/add-new-chart
    ```

### Development Workflow
1.  **Sync with Main**: Before starting, ensure your local `main` is up to date.
    ```bash
    git checkout main
    git pull origin main
    ```
2.  **Install Dependencies**: Run `npm install` to ensure you have the latest packages.
3.  **Test Your Changes**: Verify that your changes work locally before pushing.
4.  **Code Style**: Ensure your code follows the project's styling (Tailwind CSS classes, TypeScript typing).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for the Security Community.*
