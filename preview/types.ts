export type ThemeMode = 'light' | 'dark';
export type PreviewPage = 'dashboard' | 'login' | 'config' | 'luci';
export type LoginStyle = 'classic' | 'centered';
export type LangCode = 'id' | 'en';

export interface NuxLabSettings {
  mode: ThemeMode;
  lightPrimary: string;
  darkNeon: string;
  darkSecondary: string;
  loginStyle: LoginStyle;
  blur: number;
  opacity: number;
  wallpaperSource: 'none' | 'bing' | 'unsplash' | 'wallhaven';
}

export interface NeonPreset {
  id: string;
  label: string;
  darkPrimary: string;
  darkSecondary: string;
  lightPrimary: string;
}

export const NEON_PRESETS: NeonPreset[] = [
  {
    id: 'cyber-cyan',
    label: 'Cyber Cyan',
    darkPrimary: '#00e5ff',
    darkSecondary: '#d946ef',
    lightPrimary: '#4f46e5',
  },
  {
    id: 'neon-magenta',
    label: 'Synth Magenta',
    darkPrimary: '#f43f5e',
    darkSecondary: '#a855f7',
    lightPrimary: '#6366f1',
  },
  {
    id: 'matrix-emerald',
    label: 'Acid Emerald',
    darkPrimary: '#10f5a8',
    darkSecondary: '#00e5ff',
    lightPrimary: '#0d9488',
  },
  {
    id: 'solar-amber',
    label: 'Volt Amber',
    darkPrimary: '#fbbf24',
    darkSecondary: '#00e5ff',
    lightPrimary: '#4338ca',
  },
];

export const COPY = {
  id: {
    dashboard: 'Dasbor',
    // OpenWrt LuCI Menus
    menuStatus: 'Status',
    menuOverview: 'Ringkasan',
    menuRoutes: 'Rute',
    menuSysLog: 'Log Sistem',
    menuRealtime: 'Grafik Waktu Nyata',
    menuSystem: 'Sistem',
    menuSystemProps: 'Sistem',
    menuAdmin: 'Administrasi',
    menuSoftware: 'Perangkat Lunak',
    menuStartup: 'Startup',
    menuFlash: 'Cadangan / Flash',
    menuReboot: 'Mulai Ulang',
    menuServices: 'Layanan',
    menuAdblock: 'AdBlock / DNS',
    menuTerminal: 'Terminal (TTYD)',
    menuNetwork: 'Jaringan',
    menuInterfaces: 'Antarmuka',
    menuWireless: 'Nirkabel',
    menuDhcpDns: 'DHCP dan DNS',
    menuDiagnostics: 'Diagnostik',
    menuFirewall: 'Firewall',
    menuVpn: 'VPN',
    menuWireguard: 'WireGuard',
    menuOpenvpn: 'OpenVPN',
    menuLogout: 'Keluar',
    nuxlabConfig: 'Konfigurasi NuxLab',
    luciComponents: 'Komponen LuCI',
    loginPreview: 'Login (sysauth)',
    routeMode: 'Mode Rute NuxLab: Perutean Penuh',
    nodesCount: 'Node',
    usingCount: 'Menggunakan',
    countries: 'Negara',
    workMode: 'Mode Kerja Saat Ini: Virtual Wire Mode (VWire)',
    relocations: 'Jumlah Relokasi',
    relocTraffic: 'Lalu Lintas Relokasi',
    dataSaved: 'Data Tersimpan',
    dnsFilter: 'Penyaring DNS',
    httpsFilter: 'Penyaring HTTPS',
    adsBlocked: 'Pemblokiran Iklan',
    trackersBlocked: 'Pemblokiran Pelacak',
    malwareBlocked: 'Pemblokiran Malware',
    realtimeTraffic: 'Statistik Lalu Lintas Waktu Nyata',
    download: 'Unduh',
    upload: 'Unggah',
    wifiSettings: 'Pengaturan Wi-Fi',
    wifiDisabled: 'Wi-Fi Dinonaktifkan',
    wifiActive: 'Wi-Fi 6 · 5GHz Aktif',
    deviceInfo: 'Informasi Perangkat',
    memory: 'Memori',
    appRelocation: 'Relokasi Aplikasi',
    systemInfo: 'Informasi Sistem',
    uptime: 'Waktu Aktif Sistem',
    totalDown: 'Volume Unduh Total',
    totalUp: 'Volume Unggah Total',
    swVersion: 'Versi Paket NuxLab',
    publicIp: 'Alamat IP Publik',
    smartRouteLog: 'Log Rute Pintar',
    blockerLog: 'Log Pemblokir Iklan',
    domainIpTab: 'Relokasi Domain / IP',
    appTab: 'Relokasi Aplikasi',
  },
  en: {
    dashboard: 'Dashboard',
    // OpenWrt LuCI Menus
    menuStatus: 'Status',
    menuOverview: 'Overview',
    menuRoutes: 'Routes',
    menuSysLog: 'System Log',
    menuRealtime: 'Realtime Graphs',
    menuSystem: 'System',
    menuSystemProps: 'System',
    menuAdmin: 'Administration',
    menuSoftware: 'Software',
    menuStartup: 'Startup',
    menuFlash: 'Backup / Flash Firmware',
    menuReboot: 'Reboot',
    menuServices: 'Services',
    menuAdblock: 'AdBlock / DNS',
    menuTerminal: 'Terminal (TTYD)',
    menuNetwork: 'Network',
    menuInterfaces: 'Interfaces',
    menuWireless: 'Wireless',
    menuDhcpDns: 'DHCP and DNS',
    menuDiagnostics: 'Diagnostics',
    menuFirewall: 'Firewall',
    menuVpn: 'VPN',
    menuWireguard: 'WireGuard',
    menuOpenvpn: 'OpenVPN',
    menuLogout: 'Logout',
    nuxlabConfig: 'NuxLab Config',
    luciComponents: 'LuCI Components',
    loginPreview: 'Login (sysauth)',
    routeMode: 'NuxLab Route Mode: Full Routing',
    nodesCount: 'Nodes',
    usingCount: 'Active',
    countries: 'Countries',
    workMode: 'Current Work Mode: Virtual Wire Mode (VWire)',
    relocations: 'Relocation Count',
    relocTraffic: 'Relocation Traffic',
    dataSaved: 'Data Saved',
    dnsFilter: 'DNS Filtering',
    httpsFilter: 'HTTPS Filtering',
    adsBlocked: 'Ads Blocked',
    trackersBlocked: 'Trackers Blocked',
    malwareBlocked: 'Malware Blocked',
    realtimeTraffic: 'Real-Time Traffic Statistics',
    download: 'Download',
    upload: 'Upload',
    wifiSettings: 'Wi-Fi Settings',
    wifiDisabled: 'Wi-Fi Disabled',
    wifiActive: 'Wi-Fi 6 · 5GHz Active',
    deviceInfo: 'Device Telemetry',
    memory: 'Memory',
    appRelocation: 'App Relocation',
    systemInfo: 'System Information',
    uptime: 'System Uptime',
    totalDown: 'Total Download Volume',
    totalUp: 'Total Upload Volume',
    swVersion: 'NuxLab Package Version',
    publicIp: 'Public IP Address',
    smartRouteLog: 'Smart Route Log',
    blockerLog: 'Ad Blocker Log',
    domainIpTab: 'Domain / IP Relocation',
    appTab: 'App Relocation',
  },
} as const;
