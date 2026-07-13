import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Plus, Search, LogOut, Settings, Key, Users, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-xl text-slate-900">Quản Lý Doanh Nghiệp</h1>
                <p className="text-xs text-slate-500 -mt-1">Royal Việt Nam</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-slate-100 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-slate-700">
                  {user?.userType === "admin" ? `Admin: ${user?.identifier}` : user?.identifier}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Tài khoản
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Key className="mr-2 h-4 w-4" /> Đổi mật khẩu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Xin chào, {user?.identifier || "Admin"} 👋
              </h2>
              <p className="text-slate-600 mt-1">Chào mừng bạn đến với hệ thống quản lý doanh nghiệp Royal Việt Nam</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsSearchModalOpen(true)} className="gap-2">
                <Search className="w-4 h-4" /> Tìm kiếm
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" /> Thêm Doanh Nghiệp
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Tổng Doanh Nghiệp</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Kết quả tìm kiếm</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">
                  {searchResults ? searchResults.length : 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-2xl">
                <Search className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Trang hiện tại</p>
                <p className="text-4xl font-bold text-slate-900 mt-1">{page} / {totalPages || 1}</p>
              </div>
              <div className="p-3 bg-violet-100 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Hành động nhanh</p>
                <p className="text-xl font-semibold mt-1">Thêm doanh nghiệp</p>
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-white/90"
              >
                Thêm ngay
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {isEmpty ? (
          /* Beautiful Empty State */
          <div className="text-center py-16 border border-dashed rounded-3xl bg-white">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">Chưa có doanh nghiệp nào</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-8">
              Bắt đầu bằng cách thêm doanh nghiệp đầu tiên vào hệ thống để quản lý thông tin, tài khoản và hồ sơ giao dịch.
            </p>
            <Button 
              size="lg" 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              <Plus className="mr-2 h-5 w-5" /> Thêm Doanh Nghiệp Đầu Tiên
            </Button>
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

        {/* Document Transactions Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Giao dịch hồ sơ gần đây</h3>
              <p className="text-sm text-slate-500">Quản lý và theo dõi các giao dịch tài liệu</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDocumentBusiness(null)}>
              Xem tất cả
            </Button>
          </div>
          <EnhancedDocumentList 
            selectedBusinessId={documentBusiness?.id}
            selectedBusinessName={documentBusiness?.name}
            isVisible={true}
          />
        </div>
      </div>

      {/* Modals */}
      <Dialog open={isAddModalOpen || !!editingBusiness} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setEditingBusiness(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBusiness ? "Chỉnh sửa doanh nghiệp" : "Thêm doanh nghiệp mới"}</DialogTitle>
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
        <DialogContent className="max-w-md">
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
