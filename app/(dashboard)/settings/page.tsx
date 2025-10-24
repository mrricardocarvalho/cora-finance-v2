/**
 * Settings Page
 *
 * Application settings management.
 * Theme, default currency, and AI feature toggles.
 *
 * @module app/(dashboard)/settings/page
 */

import { SettingsForm } from '@/components/settings/settings-form';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-white/70 mt-2">Manage your application preferences and defaults</p>
      </div>

      {/* Settings Form */}
      <SettingsForm />
    </div>
  );
}
