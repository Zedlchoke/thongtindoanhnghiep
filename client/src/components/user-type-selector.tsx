import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users } from "lucide-react";

interface UserTypeSelectorProps {
  onSelectUserType: (userType: "admin" | "employee") => void;
}

export function UserTypeSelector({ onSelectUserType }: UserTypeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[980px]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl font-bold tracking-tighter">RVN</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-3xl tracking-tight text-slate-900">Royal Việt Nam</div>
                <div className="text-sm text-slate-500 -mt-1">Phần mềm Quản lý Doanh nghiệp</div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Chào mừng đến với hệ thống
          </h1>
          <p className="text-xl text-slate-600 max-w-md mx-auto">
            Vui lòng chọn vai trò để đăng nhập
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-[820px] mx-auto">
          {/* Admin Card */}
          <Card 
            className="group cursor-pointer border-2 border-transparent hover:border-red-200 transition-all duration-200 hover:shadow-xl rounded-3xl overflow-hidden"
            onClick={() => onSelectUserType("admin")}
          >
            <div className="bg-gradient-to-br from-red-50 to-white p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-red-100 group-hover:bg-red-200 transition-colors rounded-2xl flex items-center justify-center">
                    <Crown className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-red-600">Admin</CardTitle>
                    <CardDescription className="text-base mt-1">Quyền cao nhất</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Badge variant="destructive" className="mb-5 text-sm px-4 py-1">Toàn quyền quản lý</Badge>
                
                <ul className="space-y-2.5 text-[15px] text-slate-700 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span> Quản lý toàn bộ doanh nghiệp
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span> Xem, thêm, sửa, xóa dữ liệu
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span> Thiết lập mã truy cập cho nhân viên
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span> Quản lý hồ sơ & tài khoản
                  </li>
                </ul>

                <Button 
                  className="w-full h-12 text-base font-semibold bg-red-600 hover:bg-red-700 rounded-2xl"
                  onClick={(e) => { e.stopPropagation(); onSelectUserType("admin"); }}
                >
                  Đăng nhập với quyền Admin
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Employee Card */}
          <Card 
            className="group cursor-pointer border-2 border-transparent hover:border-emerald-200 transition-all duration-200 hover:shadow-xl rounded-3xl overflow-hidden"
            onClick={() => onSelectUserType("employee")}
          >
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-emerald-100 group-hover:bg-emerald-200 transition-colors rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-emerald-600">Nhân viên</CardTitle>
                    <CardDescription className="text-base mt-1">Quyền hạn chế</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <Badge className="mb-5 text-sm px-4 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Hỗ trợ vận hành</Badge>
                
                <ul className="space-y-2.5 text-[15px] text-slate-700 mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span> Thêm doanh nghiệp mới
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span> Tìm kiếm và xem thông tin
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span> Không thể xóa hoặc sửa
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span> Liên hệ Admin để lấy mật khẩu
                  </li>
                </ul>

                <Button 
                  className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-2xl"
                  onClick={(e) => { e.stopPropagation(); onSelectUserType("employee"); }}
                >
                  Đăng nhập với quyền Nhân viên
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-slate-500">
          © 2026 Công ty TNHH Tư Vấn & Hỗ Trợ Doanh Nghiệp Royal Việt Nam
        </div>
      </div>
    </div>
  );
}
