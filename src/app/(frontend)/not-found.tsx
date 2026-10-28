import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-site py-24 text-center">
      <p className="text-6xl font-serif text-caramel">404</p>
      <p className="mt-4 text-xl">Такой страницы нет — возможно, она завалилась за диван.</p>
      <Link href="/" className="btn btn-primary mt-8">На главную</Link>
    </div>
  )
}
