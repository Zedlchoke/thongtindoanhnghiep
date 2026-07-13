import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Plus, Search, LogOut, Settings, Key, Users, FileText, TrendingUp, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BusinessForm from "@/components/business-form";
import SearchForm from "@/components/search-form";
import BusinessList from "@/components/business-list";
import BusinessViewModal from "@/components/business-view-modal";
import { EnhancedDocumentList } from "@/components/enhanced-document-list";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-new-auth";
import type { Business } from "@shared/schema";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<Business | null>(null);
  const [searchResults, setSearchResults] = useState<Business[] | null>(null);
  const [documentBusiness, setDocumentBusiness] = useState<Business | null>(null);

  const { data: businessData, isLoading, refetch } = useQuery({
    queryKey: ["/api/businesses", { page, limit: 10, sortBy, sortOrder }],
    queryFn: async () => {
      const response = await fetch(`/api/businesses?page=${page}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!response.ok) throw new Error("Failed to fetch businesses");
      return response.json();
    },
  });

  const businesses = searchResults || businessData?.businesses || [];
  const total = businessData?.total || 0;
  const totalPages = Math.ceil(total / 10);

  const handleBusinessSaved = () => {
    setIsAddModalOpen(false);
    setEditingBusiness(null);
    setSearchResults(null);
    refetch();
  };

  const handleBusinessDeleted = () => {
    setSearchResults(null);
    refetch();
  };

  const handleSearchResults = (results: Business[]) => {
    setSearchResults(results);
    setIsSearchModalOpen(false);
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const isEmpty = total === 0 && !searchResults;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation - Improved */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-2xl tracking-tight text-slate-900">Quản Lý Doanh Nghiệp</h1>
                  <p className="text-[10px] text-slate-500 -mt-1 font-medium">ROYAL VIỆT NAM</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-sm">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-slate-700">
                  {user?.userType === "admin" ? `Admin • ${user?.identifier}` : user?.identifier}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full px-4">
                    <Settings className="h-4 w-4" />
                    Tài khoản
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <DropdownMenuItem className="cursor-pointer">
                    <Key className="mr-2 h-4 w-4" /> Đổi mật khẩu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header - More premium */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3">
                <Award className="w-3.5 h-3.5" />
                HỆ THỐNG CHUYÊN NGHIỆP
              </div>
              <h2 className="text-4xl font-bold tracking-tighter text-slate-900">
                Xin chào, {user?.identifier || "Admin"} 👋
              </h2>
              <p className="text-lg text-slate-600 mt-2 max-w-xl">
                Chào mừng bạn đến với hệ thống quản lý doanh nghiệp <span className="font-semibold text-blue-600">Royal Việt Nam</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsSearchModalOpen(true)} 
                className="gap-2 h-11 px-6 rounded-xl"
              >
                <Search className="w-4 h-4" /> Tìm kiếm
              </Button>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className="gap-2 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                <Plus className="w-4 h-4" /> Thêm Doanh Nghiệp Mới
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Significantly improved visual design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng Doanh Nghiệp</p>
                  <p className="text-5xl font-bold text-slate-900 mt-2 tracking-tighter">{total}</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-2xl">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Đang quản lý trong hệ thống</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Kết quả tìm kiếm</p>
                  <p className="text-5xl font-bold text-slate-900 mt-2 tracking-tighter">
                    {searchResults ? searchResults.length : 0}
                  </p>
                </div>
                <div className="p-4 bg-emerald-100 rounded-2xl">
                  <Search className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Kết quả hiện tại</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Trang hiện tại</p>
                  <p className="text-5xl font-bold text-slate-900 mt-2 tracking-tighter">{page} / {totalPages || 1}</p>
                </div>
                <div className="p-4 bg-violet-100 rounded-2xl">
                  <TrendingUp className="w-7 h-7 text-violet-600" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Phân trang danh sách</p>
            </CardContent>
          </Card>

          <Card 
            onClick={() => setIsAddModalOpen(true)}
            className="border-0 shadow-sm hover:shadow-lg transition-all rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white cursor-pointer active:scale-[0.985]"
          >
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div>
                <div className="p-3 w-fit bg-white/20 rounded-2xl mb-4">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-semibold text-xl tracking-tight">Thêm doanh nghiệp</p>
                <p className="text-sm opacity-80 mt-1">Bắt đầu quản lý ngay</p>
              </div>
              <div className="mt-auto pt-4">
                <Button 
                  variant="secondary" 
                  className="bg-white text-blue-700 hover:bg-white/90 w-full rounded-2xl font-semibold"
                >
                  Thêm ngay →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        {isEmpty ? (
          /* Much improved Empty State */
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
              Chưa có doanh nghiệp nào
            </h3>
            <p className="text-lg text-slate-600 max-w-md mx-auto mb-8">
              Hệ thống của bạn hiện đang trống. Hãy bắt đầu bằng cách thêm doanh nghiệp đầu tiên để quản lý thông tin, tài khoản và hồ sơ giao dịch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setIsAddModalOpen(true)}
                className="h-12 px-8 text-base rounded-2xl bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" /> Thêm Doanh Nghiệp Đầu Tiên
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setIsSearchModalOpen(true)}
                className="h-12 px-8 text-base rounded-2xl"
              >
                <Search className="mr-2 h-5 w-5" /> Tìm kiếm doanh nghiệp
              </Button>
            </div>

            <div className="mt-10 pt-8 border-t grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
              <div className="flex gap-4">
                <div className="mt-1"><Target className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <div className="font-semibold">Quản lý toàn diện</div>
                  <div className="text-sm text-slate-500 mt-0.5">Thông tin, tài khoản ngân hàng, hóa đơn điện tử...</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><FileText className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <div className="font-semibold">Giao dịch hồ sơ</div>
                  <div className="text-sm text-slate-500 mt-0.5">Theo dõi việc giao nhận tài liệu chuyên nghiệp</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><Users className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <div className="font-semibold">Phân quyền rõ ràng</div>
                  <div className="text-sm text-slate-500 mt-0.5">Admin toàn quyền • Nhân viên hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <BusinessList 
            businesses={businesses}
            isLoading={isLoading}
            onEdit={setEditingBusiness}
            onBusinessDeleted={handleBusinessDeleted}
            onViewDocuments={setDocumentBusiness}
            onViewAccounts={setViewingBusiness}
            searchResults={searchResults}
            onClearSearch={clearSearch}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isAdmin={user?.userType === "admin"}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        )}

        {/* Document Transactions Section - Always visible and improved */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Giao dịch hồ sơ gần đây</h3>
              <p className="text-slate-500 mt-1">Theo dõi việc giao nhận và xử lý tài liệu của các doanh nghiệp</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setDocumentBusiness(null)}
              className="rounded-xl"
            >
              Xem tất cả giao dịch
            </Button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-1 shadow-sm">
            <EnhancedDocumentList 
              selectedBusinessId={documentBusiness?.id}
              selectedBusinessName={documentBusiness?.name}
              isVisible={true}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <Dialog open={isAddModalOpen || !!editingBusiness} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setEditingBusiness(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingBusiness ? "Chỉnh sửa doanh nghiệp" : "Thêm doanh nghiệp mới"}</DialogTitle>
          </DialogHeader>
          <BusinessForm 
            business={editingBusiness}
            onSaved={handleBusinessSaved}
            onCancel={() => {
              setIsAddModalOpen(false);
              setEditingBusiness(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Tìm kiếm doanh nghiệp</DialogTitle>
          </DialogHeader>
          <SearchForm onResults={handleSearchResults} onCancel={() => setIsSearchModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <BusinessViewModal
        business={viewingBusiness}
        isOpen={!!viewingBusiness}
        onClose={() => setViewingBusiness(null)}
      />
    </div>
  );
}
