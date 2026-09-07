"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function SettingsPageContent() {
 const [profile, setProfile] = React.useState({ name: "Rahul Sharma", email: "rahul@business.com", phone: "+919876543210", businessName: "Sharma Enterprises", gstin: "27AABCT1234R1ZM" });
 const [notifications, setNotifications] = React.useState({ email: true, whatsapp: true, sms: false, paymentReminders: true, gstReminders: true });
 const [activeTab, setActiveTab] = React.useState("profile");

 const toggleNotification = (key: keyof typeof notifications) => {
 setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
 };

 return (
 <div className="max-w-3xl mx-auto">
 <h1 className="text-2xl font-bold mb-6">Settings</h1>
 <Tabs value={activeTab} onValueChange={setActiveTab}>
 <TabsList className="w-full justify-start">
 <TabsTrigger value="profile">Profile</TabsTrigger>
 <TabsTrigger value="business">Business</TabsTrigger>
 <TabsTrigger value="notifications">Notifications</TabsTrigger>
 <TabsTrigger value="billing">Billing</TabsTrigger>
 </TabsList>

 <TabsContent value="profile" className="mt-6">
 <Card className="p-6">
 <h3 className="font-semibold mb-4">Profile Information</h3>
 <div className="space-y-4">
 <div>
 <Label>Full Name</Label>
 <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
 </div>
 <div>
 <Label>Email</Label>
 <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
 </div>
 <div>
 <Label>Phone</Label>
 <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
 </div>
 <Button>Save Changes</Button>
 </div>
 </Card>
 </TabsContent>

 <TabsContent value="business" className="mt-6">
 <Card className="p-6">
 <h3 className="font-semibold mb-4">Business Details</h3>
 <div className="space-y-4">
 <div>
 <Label>Business Name</Label>
 <Input value={profile.businessName} onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} />
 </div>
 <div>
 <Label>GSTIN</Label>
 <Input value={profile.gstin} onChange={(e) => setProfile({ ...profile, gstin: e.target.value })} />
 <p className="text-xs text-muted-foreground mt-1">Format: 27AABCT1234R1ZM</p>
 </div>
 <Button>Save Changes</Button>
 </div>
 </Card>
 </TabsContent>

 <TabsContent value="notifications" className="mt-6">
 <Card className="p-6">
 <h3 className="font-semibold mb-4">Notification Preferences</h3>
 <div className="space-y-4">
 {Object.entries(notifications).map(([key, value]) => (
 <div key={key} className="flex items-center justify-between">
 <div>
 <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
 <p className="text-sm text-muted-foreground">Receive {key.replace(/([A-Z])/g, " $1").toLowerCase()} notifications</p>
 </div>
 <Switch checked={value} onCheckedChange={() => toggleNotification(key as keyof typeof notifications)} />
 </div>
 ))}
 </div>
 <Button className="mt-4">Save Preferences</Button>
 </Card>
 </TabsContent>

 <TabsContent value="billing" className="mt-6">
 <Card className="p-6">
 <h3 className="font-semibold mb-4">Subscription & Billing</h3>
 <div className="p-4 bg-muted/50 rounded-lg mb-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="font-medium">Current Plan: Pro</p>
 <p className="text-sm text-muted-foreground">₹999/month</p>
 </div>
 <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
 </div>
 </div>
 <div className="space-y-2 mb-4">
 <div className="flex justify-between text-sm">
 <span>Scans this month</span>
 <span>24 / 100</span>
 </div>
 <div className="w-full bg-muted rounded-full h-2">
 <div className="bg-primary h-2 rounded-full" style={{ width: "24%" }} />
 </div>
 </div>
 <Button variant="outline" className="w-full">Upgrade Plan</Button>
 </Card>
 </TabsContent>
 </Tabs>
 </div>
 );
}

export { SettingsPageContent };
