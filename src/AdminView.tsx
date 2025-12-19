import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  Fingerprint,
  Image as ImageIcon,
  Info,
  Loader2,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

export type UserPayload = {
  request_id: string;
  user_wallet: string;
  course: { course_id: string; course_name: string };
  display_name: string;
  completion: { completed: boolean; completed_at: string };
  certificate_preview: { preview_url: string | null; preview_hash: string };
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
};

export type AdminPayload = {
  request_id: string;
  recipient_wallet: string;
  course: { course_id: string; course_name: string };
  completion_status: { verified: boolean; completed_at: string };
  certificate_preview: { preview_url: string | null; preview_hash: string };
  admin_decision: {
    status: "pending" | "approved" | "rejected";
    reviewed_by: string;
    reviewed_at: string;
    note: string;
  };
};

export type AdminQueueEntry = {
  requestId: string;
  studentName: string;
  courseName: string;
  courseId: string;
  completionDate: string;
  wallet: string;
  certificatePreview?: string | null;
  userPayload: UserPayload;
  adminPayload: AdminPayload;
};

export type NotificationItem = {
  id: string;
  requestId: string;
  message: string;
  createdAt: string;
  status: "pending" | "seen";
};

const SuiLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 0C50 0 20 35 20 60C20 76.5685 33.4315 90 50 90C66.5685 90 80 76.5685 80 60C80 35 50 0 50 0Z" fill="currentColor" />
    <path
      d="M50 15C50 15 30 40 30 60C30 71.0457 38.9543 80 50 80C61.0457 80 70 71.0457 70 60C70 40 50 15 50 15Z"
      fill="white"
      fillOpacity="0.3"
    />
  </svg>
);

const Navbar: React.FC<{ adminAddress: string; onExit?: () => void }> = ({ adminAddress, onExit }) => {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <SuiLogo className="text-white w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 leading-none tracking-tight uppercase italic">Sui Mint Portal</span>
            <span className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase italic">Administrator Access</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Authorized Issuer</span>
              <span className="text-[11px] font-mono text-slate-600">{adminAddress}</span>
            </div>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
            >
              Thoát Admin
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const NotificationQueue: React.FC<{ items: NotificationItem[]; onMarkSeen?: (id: string) => void }> = ({ items, onMarkSeen }) => {
  if (!items.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 text-xs text-slate-500 font-bold">
        Chưa có thông báo mới.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 space-y-3 shadow-sm">
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.requestId}</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-800 leading-tight">{item.message}</p>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
          </div>
          <button
            onClick={() => onMarkSeen?.(item.id)}
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
              item.status === "seen"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            }`}
          >
            {item.status === "seen" ? "Đã xem" : "Đánh dấu đã xem"}
          </button>
        </div>
      ))}
    </div>
  );
};

const PayloadPreview: React.FC<{ adminPayload: AdminPayload }> = ({ adminPayload }) => (
  <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-emerald-700 text-[11px] font-black uppercase tracking-widest">
        <Fingerprint className="w-4 h-4" />
        <span>Payload admin (admin.txt)</span>
      </div>
      <span className="text-[10px] font-bold text-slate-400">Chuyển đổi off-chain</span>
    </div>
    <pre className="bg-slate-900 text-emerald-300 text-[10px] font-mono p-4 rounded-xl overflow-auto max-h-64 border border-slate-800">
      {JSON.stringify(adminPayload, null, 2)}
    </pre>
  </div>
);

const AdminView: React.FC<{
  onExit?: () => void;
  certificateImage?: string | null;
  requests?: AdminQueueEntry[];
  notifications?: NotificationItem[];
  onMarkNotificationSeen?: (id: string) => void;
}> = ({ onExit, certificateImage, requests = [], notifications = [], onMarkNotificationSeen }) => {
  const [selectedRequest, setSelectedRequest] = useState<AdminQueueEntry | null>(requests[0] ?? null);
  const [activeTab, setActiveTab] = useState<"metadata" | "image">("metadata");
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<{ success: boolean; tx: string }>({ success: false, tx: "" });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    if (requests.length && requests[0].requestId !== selectedRequest?.requestId) {
      setSelectedRequest(requests[0]);
      setMintStatus({ success: false, tx: "" });
    }
  }, [requests]);

  const handleMint = () => {
    if (!selectedRequest) return;
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setMintStatus({
        success: true,
        tx: "0x" + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      });
    }, 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedImage(URL.createObjectURL(file));
  };

  const effectivePreviewUrl =
    selectedRequest?.adminPayload.certificate_preview?.preview_url ||
    selectedRequest?.certificatePreview ||
    certificateImage ||
    null;

  const adminPayloadWithPreview: AdminPayload | null = selectedRequest
    ? {
        ...selectedRequest.adminPayload,
        certificate_preview: {
          preview_url: effectivePreviewUrl,
          preview_hash: selectedRequest.adminPayload.certificate_preview?.preview_hash || selectedRequest.userPayload?.certificate_preview?.preview_hash || "",
        },
      }
    : null;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans antialiased overflow-x-hidden">
      <Navbar adminAddress="0x8e2b...4f91" onExit={onExit} />

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                  <Bell className="w-4 h-4 mr-2 text-indigo-600" />
                  Yêu cầu phê duyệt
                </h3>
                <div className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-full">MỚI</div>
              </div>

              <div className="space-y-3">
                {requests.map((req) => (
                  <button
                    key={req.requestId}
                    onClick={() => {
                      setSelectedRequest(req);
                      setMintStatus({ success: false, tx: "" });
                    }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedRequest?.requestId === req.requestId ? "border-indigo-600 bg-indigo-50/30 shadow-md" : "border-slate-50 bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">{req.requestId}</span>
                      <Clock className="w-3 h-3 text-slate-300" />
                    </div>
                    <p className="font-black text-slate-900 truncate text-sm">{req.studentName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate">{req.courseName}</span>
                      <ArrowRight className="w-3 h-3 text-indigo-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu size={80} />
              </div>
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-4">Hệ thống Phát hành</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold border-b border-white/5 pb-2">
                    <span className="opacity-50 uppercase tracking-tighter">Mạng lưới</span>
                    <span className="text-emerald-400">SUI MAINNET</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold border-b border-white/5 pb-2">
                    <span className="opacity-50 uppercase tracking-tighter">Quyền hạn</span>
                    <span className="text-indigo-400">MINTER_ADMIN</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Node Status</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] text-emerald-500 font-black">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                  <Bell className="w-4 h-4 mr-2 text-indigo-600" />
                  Thông báo queue
                </h3>
                <div className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-black rounded-full">{notifications.length}</div>
              </div>
              <NotificationQueue items={notifications} onMarkSeen={onMarkNotificationSeen} />
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedRequest ? (
              <div className="space-y-6">
                <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex shadow-sm">
                  <button
                    onClick={() => setActiveTab("metadata")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === "metadata" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Database size={16} />
                    <span>Mint Metadata Chuẩn</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("image")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === "image" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <ImageIcon size={16} />
                    <span>Chuyển Ảnh thành NFT</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <SuiLogo className="text-slate-900 w-6 h-6" />
                      </div>
                      <Award className="text-indigo-500 w-10 h-10" />
                    </div>

                    <div className="text-center space-y-4 mb-8 flex-1 flex flex-col justify-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bản xem trước chứng chỉ</p>
                      {selectedRequest.certificatePreview || certificateImage ? (
                        <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                          <img
                            src={selectedRequest.certificatePreview || certificateImage || ""}
                            alt="Certificate Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-2xl font-serif italic text-slate-900">{selectedRequest.studentName}</h2>
                          <div className="h-px w-16 bg-slate-100 mx-auto" />
                          <p className="text-xs font-bold text-slate-600 leading-tight uppercase tracking-tighter">{selectedRequest.courseName}</p>
                        </>
                      )}
                    </div>

                    <div className="mt-6 space-y-2 pt-4 border-t border-slate-50">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-400 uppercase tracking-tighter">Ví sinh viên</span>
                        <span className="text-slate-900 font-mono truncate max-w-[120px]">{selectedRequest.wallet}</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-slate-400 uppercase tracking-tighter">Ngày hoàn thành</span>
                        <span className="text-slate-900">{selectedRequest.completionDate}</span>
                      </div>
                    </div>
                  </div>

                  {activeTab === "metadata" ? (
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                        <Fingerprint className="w-4 h-4 mr-2 text-indigo-600" />
                        Đúc Dữ liệu Blockchain
                      </h3>

                      <div className="flex-1 space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[9px] text-slate-500 font-bold leading-relaxed italic">
                            Payload gửi admin (admin.txt) sẽ được dùng cho bước đúc, không hiển thị metadata mẫu.
                          </p>
                        </div>
                        {adminPayloadWithPreview && <PayloadPreview adminPayload={adminPayloadWithPreview} />}
                      </div>

                      <button
                        onClick={handleMint}
                        disabled={isMinting || mintStatus.success}
                        className={`mt-6 w-full flex items-center justify-center space-x-3 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                          mintStatus.success ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-black shadow-slate-200"
                        }`}
                      >
                        {isMinting ? (
                          <>
                            <Loader2 className="animate-spin size-4" /> <span>Đang xử lý...</span>
                          </>
                        ) : mintStatus.success ? (
                          <>
                            <CheckCircle2 size={16} /> <span>Đã đúc xong</span>
                          </>
                        ) : (
                          <>
                            <Rocket size={16} /> <span>Xác nhận & Mint NFT</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2 text-indigo-600" />
                        Đúc NFT từ Hình ảnh
                      </h3>

                      <div className="flex-1 space-y-6">
                        <div
                          className={`relative aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all ${
                            uploadedImage ? "border-indigo-400 bg-white" : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          {uploadedImage ? (
                            <img src={uploadedImage} className="w-full h-full object-cover" alt="NFT Preview" />
                          ) : (
                            <div className="text-center p-6">
                              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Tải lên thiết kế chứng chỉ</p>
                              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                          )}
                          {uploadedImage && (
                            <button
                              onClick={() => setUploadedImage(null)}
                              className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-[8px] uppercase font-bold backdrop-blur-sm"
                            >
                              Thay đổi
                            </button>
                          )}
                        </div>

                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                          <div className="flex items-start space-x-2 text-indigo-700">
                            <Info size={14} className="mt-0.5 flex-shrink-0" />
                            <p className="text-[9px] leading-relaxed font-bold">
                              Hình ảnh sẽ được đúc thành NFT hình ảnh thuần túy, định danh qua tên học viên và mã khóa học.
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={!uploadedImage || isMinting}
                        className={`mt-6 w-full flex items-center justify-center space-x-3 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
                          !uploadedImage ? "bg-slate-100 text-slate-300" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                        }`}
                      >
                        <Rocket size={16} />
                        <span>Đúc NFT Hình ảnh</span>
                      </button>
                    </div>
                  )}
                </div>

                {mintStatus.success && (
                  <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-2xl shadow-emerald-100/50 animate-in slide-in-from-bottom duration-500">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-2 text-emerald-600">
                          <CheckCircle2 size={18} />
                          <span className="text-sm font-black uppercase tracking-tight italic">Giao dịch thành công!</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Hash</span>
                          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-mono font-bold text-slate-500 truncate">{mintStatus.tx}</p>
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-500 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 shadow-md hover:bg-black transition-all">
                          <Search size={14} /> <span>Explorer</span>
                        </button>
                        <button className="bg-white border border-slate-200 text-slate-600 px-4 py-3.5 rounded-xl font-black text-[10px] uppercase shadow-sm">
                          <Sparkles size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-10 opacity-60">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Database className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-xl font-black text-slate-400 uppercase italic">Chờ phê duyệt hồ sơ</h2>
                <p className="text-slate-400 text-sm max-w-xs mt-2">Vui lòng chọn một yêu cầu từ danh sách bên trái để thực hiện kiểm tra và đúc chứng chỉ NFT.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-widest gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
              <SuiLogo className="text-slate-300 w-6 h-6" />
            </div>
            <p>© 2024 SUI ACADEMY - ISSUANCE PORTAL. VERSION 1.1-MANUAL.</p>
          </div>
          <div className="flex space-x-12 opacity-50 italic font-bold">
            <span className="flex items-center">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" /> NETWORK: SUI MAINNET
            </span>
            <span>SYSTEM: MANUAL CONTROL</span>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default AdminView;
