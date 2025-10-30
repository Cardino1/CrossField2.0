"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { format } from "date-fns";
import type { CollaborationDto, NewsDto, PostDto, SubscriberDto } from "@/lib/dtos";

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(160).optional(),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  body: z.string().min(10),
  imageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional(),
  published: z.boolean().default(true),
});

const newsSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3).max(160),
  summary: z.string().max(300).optional().or(z.literal("")),
  body: z.string().min(10),
  publishedAt: z.string().optional(),
  published: z.boolean().default(true),
});

type PostFormValues = z.infer<typeof postSchema>;
type NewsFormValues = z.infer<typeof newsSchema>;

type Tab = "requests" | "posts" | "news" | "subscribers";

type Props = {
  collaborations: CollaborationDto[];
  posts: PostDto[];
  news: NewsDto[];
  subscribers: SubscriberDto[];
};

export function AdminDashboard({ collaborations, posts, news, subscribers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("requests");
  const [collaborationItems, setCollaborationItems] = useState(collaborations);
  const [postItems, setPostItems] = useState(posts);
  const [newsItems, setNewsItems] = useState(news);
  const [subscriberItems, setSubscriberItems] = useState(subscribers);

  const requestGroups = useMemo(() => {
    return {
      PENDING: collaborationItems.filter((item) => item.status === "PENDING"),
      APPROVED: collaborationItems.filter((item) => item.status === "APPROVED"),
      REJECTED: collaborationItems.filter((item) => item.status === "REJECTED"),
    };
  }, [collaborationItems]);

  const handleCollaborationAction = async (id: string, action: "APPROVE" | "REJECT" | "DELETE") => {
    try {
      if (action === "DELETE") {
        const res = await fetch(`/api/admin/collaborations/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Unable to delete");
        setCollaborationItems((items) => items.filter((item) => item.id !== id));
        toast.success("Deleted");
        return;
      }
      const res = await fetch(`/api/admin/collaborations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "APPROVE" ? "APPROVED" : "REJECTED" }),
      });
      if (!res.ok) throw new Error("Unable to update");
      const data = await res.json();
      setCollaborationItems((items) => items.map((item) => (item.id === id ? { ...item, status: data.status } : item)));
      toast.success(action === "APPROVE" ? "Approved" : "Rejected");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const createOrUpdatePost = async (values: PostFormValues) => {
    const { id, ...rest } = values;
    const payload = {
      ...rest,
      excerpt: rest.excerpt ? rest.excerpt : undefined,
      imageUrl: rest.imageUrl ? rest.imageUrl : undefined,
      tags: rest.tags
        ? rest.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };
    const isUpdate = Boolean(values.id);
    const endpoint = isUpdate ? `/api/admin/posts/${values.id}` : "/api/admin/posts";
    const method = isUpdate ? "PATCH" : "POST";
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Unable to save" }));
      toast.error(data.message ?? "Unable to save");
      return;
    }
    const data = await res.json();
    setPostItems((items) => {
      if (isUpdate) {
        return items.map((item) => (item.id === data.id ? data : item));
      }
      return [data, ...items];
    });
    toast.success(isUpdate ? "Post updated" : "Post published");
  };

  const deletePost = async (id: string) => {
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Unable to delete post");
      return;
    }
    setPostItems((items) => items.filter((item) => item.id !== id));
    toast.success("Post deleted");
  };

  const createOrUpdateNews = async (values: NewsFormValues) => {
    const { id, ...rest } = values;
    const payload = {
      ...rest,
      summary: rest.summary ? rest.summary : undefined,
      publishedAt: rest.publishedAt ? rest.publishedAt : undefined,
    };
    const isUpdate = Boolean(values.id);
    const endpoint = isUpdate ? `/api/admin/news/${values.id}` : "/api/admin/news";
    const method = isUpdate ? "PATCH" : "POST";
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: "Unable to save" }));
      toast.error(data.message ?? "Unable to save");
      return;
    }
    const data = await res.json();
    setNewsItems((items) => {
      if (isUpdate) {
        return items.map((item) => (item.id === data.id ? data : item));
      }
      return [data, ...items];
    });
    toast.success(isUpdate ? "News updated" : "News published");
  };

  const deleteNews = async (id: string) => {
    const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Unable to delete news");
      return;
    }
    setNewsItems((items) => items.filter((item) => item.id !== id));
    toast.success("News deleted");
  };

  const exportSubscribers = async () => {
    const res = await fetch("/api/admin/subscribers/export");
    if (!res.ok) {
      toast.error("Unable to export subscribers");
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crossfield-subscribers-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Exported subscribers");
  };

  return (
    <div className="container-grid space-y-8 py-10">
      <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-soft">
        <TabButton tab="requests" activeTab={activeTab} onSelect={setActiveTab}>
          Requests
        </TabButton>
        <TabButton tab="posts" activeTab={activeTab} onSelect={setActiveTab}>
          Posts
        </TabButton>
        <TabButton tab="news" activeTab={activeTab} onSelect={setActiveTab}>
          News
        </TabButton>
        <TabButton tab="subscribers" activeTab={activeTab} onSelect={setActiveTab}>
          Subscribers
        </TabButton>
      </div>

      {activeTab === "requests" && (
        <section className="space-y-10">
          {(["PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">{status}</h2>
                <span className="text-sm text-slate-500">{requestGroups[status].length} submissions</span>
              </div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {requestGroups[status].map((item) => (
                      <tr key={item.id}>
                        <td className="align-top">
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="text-sm text-slate-500">{item.fullName}</p>
                        </td>
                        <td className="align-top text-sm text-slate-500">{item.type.replace(/_/g, " ")}</td>
                        <td className="align-top text-sm text-slate-500">
                          {format(new Date(item.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="align-top">
                          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide">
                            {status !== "APPROVED" && (
                              <button
                                onClick={() => handleCollaborationAction(item.id, "APPROVE")}
                                className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 hover:bg-emerald-500/20"
                              >
                                Approve
                              </button>
                            )}
                            {status !== "REJECTED" && (
                              <button
                                onClick={() => handleCollaborationAction(item.id, "REJECT")}
                                className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-600 hover:bg-amber-500/20"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleCollaborationAction(item.id, "DELETE")}
                              className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-600 hover:bg-rose-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {requestGroups[status].length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                          No {status.toLowerCase()} submissions yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      )}

      {activeTab === "posts" && (
        <PostManager items={postItems} onSave={createOrUpdatePost} onDelete={deletePost} />
      )}

      {activeTab === "news" && (
        <NewsManager items={newsItems} onSave={createOrUpdateNews} onDelete={deleteNews} />
      )}

      {activeTab === "subscribers" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Subscribers</h2>
              <p className="text-sm text-slate-500">Capture-only list of community emails.</p>
            </div>
            <button
              onClick={exportSubscribers}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Export CSV
            </button>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subscriberItems.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className="text-sm text-slate-700">{subscriber.email}</td>
                    <td className="text-sm text-slate-500">
                      {format(new Date(subscriber.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
                {subscriberItems.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-sm text-slate-500">
                      No subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function TabButton({
  tab,
  activeTab,
  onSelect,
  children,
}: {
  tab: Tab;
  activeTab: Tab;
  onSelect: (tab: Tab) => void;
  children: ReactNode;
}) {
  const active = tab === activeTab;
  return (
    <button
      onClick={() => onSelect(tab)}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
        active ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function PostManager({
  items,
  onSave,
  onDelete,
}: {
  items: PostDto[];
  onSave: (values: PostFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState<PostDto | null>(null);
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: true,
    },
  });

  const submit = async (values: PostFormValues) => {
    await onSave(values);
    form.reset({ published: true });
    setEditing(null);
  };

  const startEdit = (item: PostDto) => {
    setEditing(item);
    form.reset({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? "",
      body: item.body,
      imageUrl: item.imageUrl ?? "",
      tags: item.tags.join(", "),
      published: item.published,
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">{editing ? "Edit Post" : "Publish Post"}</h2>
        <form onSubmit={form.handleSubmit(submit)} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-600">Title</label>
            <input {...form.register("title")} />
            {form.formState.errors.title && <p className="text-sm text-rose-500">{form.formState.errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Slug (optional)</label>
            <input {...form.register("slug")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Tags (comma separated)</label>
            <input {...form.register("tags")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Image URL</label>
            <input {...form.register("imageUrl")} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-600">Excerpt</label>
            <textarea rows={3} {...form.register("excerpt")} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-600">Body (Markdown supported)</label>
            <textarea rows={6} {...form.register("body")} />
            {form.formState.errors.body && <p className="text-sm text-rose-500">{form.formState.errors.body.message}</p>}
          </div>
          <div className="md:col-span-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" {...form.register("published")} />
              Published
            </label>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  form.reset({ published: true });
                }}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Cancel edit
              </button>
            )}
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              {editing ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <span className={`badge ${item.published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                {item.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-sm text-slate-500">Updated {format(new Date(item.updatedAt), "MMM d, yyyy")}</p>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <button onClick={() => startEdit(item)} className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200">
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-full bg-rose-100 px-3 py-1 text-rose-600 hover:bg-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            No posts yet. Publish your first one above.
          </div>
        )}
      </div>
    </section>
  );
}

function NewsManager({
  items,
  onSave,
  onDelete,
}: {
  items: NewsDto[];
  onSave: (values: NewsFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState<NewsDto | null>(null);
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      published: true,
    },
  });

  const submit = async (values: NewsFormValues) => {
    await onSave(values);
    form.reset({ published: true });
    setEditing(null);
  };

  const startEdit = (item: NewsDto) => {
    setEditing(item);
    form.reset({
      id: item.id,
      title: item.title,
      summary: item.summary ?? "",
      body: item.body,
      publishedAt: item.publishedAt.split("T")[0],
      published: item.published,
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">{editing ? "Edit News" : "Publish News"}</h2>
        <form onSubmit={form.handleSubmit(submit)} className="mt-4 grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Title</label>
            <input {...form.register("title")} />
            {form.formState.errors.title && <p className="text-sm text-rose-500">{form.formState.errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Summary</label>
            <textarea rows={3} {...form.register("summary")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Body</label>
            <textarea rows={6} {...form.register("body")} />
            {form.formState.errors.body && <p className="text-sm text-rose-500">{form.formState.errors.body.message}</p>}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Publish Date</label>
              <input type="date" {...form.register("publishedAt")} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" {...form.register("published")} />
              Published
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            {editing ? "Update News" : "Publish News"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                form.reset({ published: true });
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel edit
            </button>
          )}
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <span className={`badge ${item.published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                {item.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-sm text-slate-500">Published {format(new Date(item.publishedAt), "MMM d, yyyy")}</p>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <button onClick={() => startEdit(item)} className="rounded-full bg-slate-100 px-3 py-1 hover:bg-slate-200">
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-full bg-rose-100 px-3 py-1 text-rose-600 hover:bg-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            No news yet. Publish your first update above.
          </div>
        )}
      </div>
    </section>
  );
}
