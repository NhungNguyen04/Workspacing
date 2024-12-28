import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
        <div className='p-10'>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.facebook.com/nhungularity/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.linkedin.com/in/nhungularity" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
              <FaLinkedin size={24} />
            </a>
            <a href="https://github.com/NhungNguyen04/Workspacing" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900">
              <FaGithub size={24} />
            </a>
          </div>
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} NhungNguyen04. All rights reserved.
          </p>
          <p className="text-center text-sm text-gray-500">
            Contact: <a href="mailto:nguyennhungforwork04@gmail.com" className="text-blue-500 hover:underline">Email</a>
          </p>
        </div>
    </footer>
  )
}

export default Footer
