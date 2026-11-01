"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, authAPI, GoogleConnectResponse } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

type GoogleIntegrationStatus =
  | "not_configured"
  | "missing_client_credentials"
  | "credentials_saved_not_connected"
  | "connected";

type EmailIntegrationTabProps = {
  connected: boolean;
  setConnected: (val: boolean) => void;
};

export default function EmailIntegrationTab({
  connected,
  setConnected,
}: EmailIntegrationTabProps) {
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [credentialsSaved, setCredentialsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [connectedEmail, setConnectedEmail] = useState("");
  const [googleStatus, setGoogleStatus] =
    useState<GoogleIntegrationStatus>("not_configured");

  const frontendRedirectUrl = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return `${window.location.origin}/agent/setting`;
  }, []);

  const backendRedirectUri = `${API_BASE_URL}/auth/google/callback`;

  useEffect(() => {
    const loadGoogleStatus = async () => {
      if (!token) return;

      try {
        const response = await authAPI.getGoogleStatus(token);
        const status = response.result;
        const nextStatus = status?.status || "not_configured";
        const hasCredentials = Boolean(
          status?.has_client_credentials ||
            (status?.client_id_exists && status?.client_secret_exists),
        );
        const isConnected = Boolean(
          nextStatus === "connected" ||
            status?.connected ||
            status?.google_user_token_exists,
        );

        setGoogleStatus(nextStatus);
        setConnected(isConnected);
        setCredentialsSaved(hasCredentials);
        setConnectedEmail(status?.email || "");
      } catch (error) {
        console.error("Failed to load Google integration status", error);
      }
    };

    const handleGoogleRedirectResult = async () => {
      const params = new URLSearchParams(window.location.search);
      const googleConnected = params.get("google_connected");

      if (googleConnected === "true") {
        setStatusMessage("Google account connected successfully.");
        router.replace("/agent/setting");
      }
    };

    loadGoogleStatus();
    handleGoogleRedirectResult();
  }, [router, setConnected, token]);

  const getGoogleAuthUrl = (result?: GoogleConnectResponse) =>
    result?.authorization_url;

  const statusDetails: Record<
    GoogleIntegrationStatus,
    { label: string; description: string; className: string }
  > = {
    not_configured: {
      label: "Not Configured",
      description:
        "No Google client credentials are saved. Save your Client ID and Client Secret first.",
      className: "bg-red-100 text-red-600",
    },
    missing_client_credentials: {
      label: "Missing Credentials",
      description:
        "Google settings exist, but the Client ID or Client Secret is missing.",
      className: "bg-amber-100 text-amber-700",
    },
    credentials_saved_not_connected: {
      label: "Credentials Saved",
      description:
        "Google client credentials are saved. Complete Google sign-in to connect the account.",
      className: "bg-blue-100 text-blue-700",
    },
    connected: {
      label: "Connected",
      description: connectedEmail
        ? `${connectedEmail} is connected. Calendar, Meet, and other services are accessible.`
        : "Your Google account is connected. Calendar, Meet, and other services are accessible.",
      className: "bg-green-100 text-green-700",
    },
  };

  const currentStatus = connected
    ? statusDetails.connected
    : statusDetails[googleStatus];

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (
        error as {
          response?: { data?: { message?: string; errors?: string } };
        }
      ).response;

      return response?.data?.message || response?.data?.errors || fallback;
    }

    return error instanceof Error ? error.message : fallback;
  };

  const handleSaveCredentials = async () => {
    if (!token) {
      setStatusMessage("Please sign in before saving Google credentials.");
      return;
    }

    if (!clientId || !clientSecret) {
      setStatusMessage("Please enter both Client ID and Client Secret.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Saving Google credentials...");

      const response = await authAPI.saveGoogleCredentials(
        {
          client_id: clientId.trim(),
          client_secret: clientSecret.trim(),
        },
        token,
      );

      setCredentialsSaved(true);
      setGoogleStatus("credentials_saved_not_connected");
      setStatusMessage(
        response.message || "Credentials are ready. Continue with Google sign-in.",
      );
    } catch (error: unknown) {
      console.error("Failed to save Google credentials", error);
      setCredentialsSaved(false);
      setStatusMessage(
        getErrorMessage(error, "Failed to save Google credentials."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleConnect = async () => {
    if (!token) {
      setStatusMessage("Please sign in before connecting a Google account.");
      return;
    }

    if (!credentialsSaved) {
      setStatusMessage("Please save Google credentials before signing in.");
      return;
    }

    if (!frontendRedirectUrl) {
      setStatusMessage("Unable to prepare the frontend redirect URL.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Starting Google authentication...");

      const response = await authAPI.connectGoogle(
        {
          redirect_uri: backendRedirectUri,
          frontend_redirect_url: frontendRedirectUrl,
        },
        token,
      );
      const authUrl = getGoogleAuthUrl(response.result);

      if (!authUrl) {
        throw new Error(
          "Google authorization URL was not returned by the API.",
        );
      }

      window.location.href = authUrl;
    } catch (error: unknown) {
      console.error("Google connect failed", error);
      setStatusMessage(
        getErrorMessage(error, "Failed to start Google authentication."),
      );
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!token) {
      setStatusMessage("Please sign in before disconnecting Google.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("");

      const response = await authAPI.disconnectGoogle(token);

      setConnected(false);
      setCredentialsSaved(true);
      setGoogleStatus("credentials_saved_not_connected");
      setConnectedEmail("");
      setStatusMessage(response.message || "Google account disconnected.");
    } catch (error: unknown) {
      console.error("Disconnect failed", error);
      setStatusMessage(getErrorMessage(error, "Failed to disconnect Gmail."));
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
            {currentStatus.description}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.className}`}
        >
          {currentStatus.label}
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
              disabled={!credentialsSaved || loading || !token}
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
              {connectedEmail
                ? `${connectedEmail} is active for Calendar, Meet, and other Google services.`
                : "Account integration is active for Calendar, Meet, and other Google services."}
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
