"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, FileText, Users, Inbox } from "lucide-react";

interface PublicUser {
  id: string;
  email: string;
  verified: boolean;
  resume: { filename: string; url: string; uploadedAt: string } | null;
  createdAt: string;
}

interface OutboxEmail {
  id: string;
  to: string;
  subject: string;
  text: string;
  sentAt: string;
  mode: "smtp" | "dev";
}

export function UsersPanel() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [outbox, setOutbox] = useState<OutboxEmail[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
    fetch("/api/admin/outbox")
      .then((res) => res.json())
      .then(setOutbox);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <Users className="h-5 w-5 text-emerald-600" />
            Registered Job Seekers
          </CardTitle>
          <p className="text-sm text-slate-500">
            {users.length} account{users.length !== 1 ? "s" : ""} created
          </p>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No accounts yet.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-700">{u.email}</span>
                    <p className="text-xs text-slate-400">
                      Joined {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        u.verified
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      }
                    >
                      {u.verified ? "Verified" : "Unverified"}
                    </Badge>
                    {u.resume && (
                      <a
                        href={u.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Resume
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
            <Inbox className="h-5 w-5 text-emerald-600" />
            Dev Mailbox
          </CardTitle>
          <p className="text-sm text-slate-500">
            No SMTP credentials are configured yet, so verification emails are captured here
            instead of a real inbox. Add SMTP_HOST/SMTP_USER/SMTP_PASS env vars to send real
            email.
          </p>
        </CardHeader>
        <CardContent>
          {outbox.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">No emails sent yet.</p>
          ) : (
            <div className="space-y-3">
              {outbox.map((mail) => (
                <div key={mail.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <Mail className="h-3.5 w-3.5 text-emerald-600" />
                      {mail.subject}
                    </span>
                    <Badge
                      className={
                        mail.mode === "smtp"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                      }
                    >
                      {mail.mode === "smtp" ? "sent via SMTP" : "dev capture"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    To: {mail.to} · {new Date(mail.sentAt).toLocaleString()}
                  </p>
                  <Separator className="my-2" />
                  <pre className="whitespace-pre-wrap text-xs text-slate-500">{mail.text}</pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
