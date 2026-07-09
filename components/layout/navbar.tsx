import DesktopHeader from "./desktop-header"
import MobileHeader from "./mobile-header"

export default function Navbar() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>
      <div className="block lg:hidden">
        <MobileHeader />
      </div>
    </>
  )
}
