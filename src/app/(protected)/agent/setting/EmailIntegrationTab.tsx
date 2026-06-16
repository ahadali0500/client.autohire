"use client";

import { useState } from "react";

type EmailIntegrationTabProps = {
  connected: boolean;
  setConnected: (val: boolean) => void;
};

export default function EmailIntegrationTab({
  connected,
  setConnected,
}: EmailIntegrationTabProps) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [credentialsSaved, setCredentialsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSaveCredentials = async () => {
    if (!clientId || !clientSecret) {
      setStatusMessage("Please enter both Client ID and Client Secret.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("");

      // TODO: send to backend
      // await fetch("/api/gmail/save-credentials", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
      // });

      setCredentialsSaved(true);
      setStatusMessage("Credentials saved successfully.");
    } catch (error) {
      console.error("Failed to save credentials", error);
      setStatusMessage("Failed to save Gmail credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleConnect = async () => {
    try {
      setLoading(true);
      setStatusMessage("");

      // TODO: get auth URL from backend and redirect
      // const res = await fetch("/api/gmail/auth-url");
      // const data = await res.json();
      // window.location.href = data.auth_url;

      // Mock success
      setTimeout(() => {
        setConnected(true);
        setStatusMessage("Gmail connected successfully.");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Google connect failed", error);
      setStatusMessage("Failed to start Google authentication.");
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setStatusMessage("");

      // TODO: backend disconnect endpoint
      // await fetch("/api/gmail/disconnect", { method: "POST" });

      setConnected(false);
      setCredentialsSaved(false);
      setClientId("");
      setClientSecret("");
      setStatusMessage("Gmail disconnected successfully.");
    } catch (error) {
      console.error("Disconnect failed", error);
      setStatusMessage("Failed to disconnect Gmail.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <section className="bg-card p-6 rounded-xl border border-theme space-y-5">
  <h2 className="text-lg font-semibold">Google Account Integration</h2>

  {/* Connection Status */}
  <div className="flex items-center justify-between p-4 rounded-lg border border-theme bg-surface">
    <div>
      <p className="text-sm font-medium">Account Connection Status</p>
      <p className="text-xs text-subtext mt-1">
        {connected
          ? "Your Google account is connected. Calendar, Meet, and other services are accessible."
          : "No Google account connected. Please configure credentials and authenticate."}
      </p>
    </div>

    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      {connected ? "Connected" : "Not Connected"}
    </span>
  </div>

  {/* Not Connected */}
  {!connected && (
    <div className="p-4 rounded-lg border border-theme bg-surface space-y-4">
      <h3 className="text-sm font-semibold">Google OAuth Credentials</h3>

      <div>
        <label className="block text-sm mb-1">Client ID</label>
        <input
          type="text"
          placeholder="Enter Google Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full px-3 py-2 border border-theme bg-bg rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Client Secret</label>
        <input
          type="password"
          placeholder="Enter Google Client Secret"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          className="w-full px-3 py-2 border border-theme bg-bg rounded-lg text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSaveCredentials}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Credentials"}
        </button>

        <button
          onClick={handleGoogleConnect}
          disabled={!credentialsSaved || loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  )}

  {/* Connected */}
  {connected && (
    <div className="p-4 rounded-lg border border-theme bg-surface flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">Google Account Connected</p>
        <p className="text-xs text-subtext mt-1">
          Account integration is active for Calendar, Meet, and other Google services.
        </p>
      </div>

      <button
        onClick={handleDisconnect}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm disabled:opacity-50"
      >
        {loading ? "Disconnecting..." : "Disconnect Account"}
      </button>
    </div>
  )}

  {statusMessage && (
    <p
      className={`text-sm ${
        statusMessage.toLowerCase().includes("failed")
          ? "text-red-600"
          : "text-green-600"
      }`}
    >
      {statusMessage}
    </p>
  )}
</section>
  );
}