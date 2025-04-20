// src/app/admin/settings/page.tsx

"use client";

import { useState } from "react";
import { Label } from "@/components/ui/Label"; // if it exists
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/switch";


export default function AdminSettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    // Future: Save to Firestore or remote config
    alert("Settings saved!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      <Card>
        <CardContent className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            <Switch
              id="maintenance-mode"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
