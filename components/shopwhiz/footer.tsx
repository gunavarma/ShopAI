export function Footer() {
  return (
    <footer className="w-full mt-10 p-6 bg-gradient-to-t from-gray-50 to-transparent">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center text-sm text-gray-800">
        <p>© 2024 Shopwhiz, Inc. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a className="hover:underline" href="#">Support</a>
          <a className="hover:underline" href="#">Privacy Policy</a>
          <div className="flex gap-4">
            <a className="text-gray-600 hover:text-gray-900" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.8 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.34 0 11.35-6.08 11.35-11.35 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08z"></path></svg>
            </a>
            <a className="text-gray-600 hover:text-gray-900" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
