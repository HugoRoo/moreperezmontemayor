export interface Profile {
  _id: string
  username: string
  fullName: string
  email: string
  role: 'admin' | 'member'
  createdAt: string
}

export interface Book {
  _id: string
  title: string
  author: string
  coverUrl: string | null
  description: string | null
  month: number
  year: number
  isCurrent: boolean
  createdAt: string
}

export interface Post {
  _id: string
  bookId: string
  author: {
    _id: string
    username: string
    fullName: string
  }
  content: string
  imageUrl: string | null
  linkUrl: string | null
  createdAt: string
}

export interface MeetingLink {
  _id: string
  url: string
  label: string
  createdBy: string | null
  createdAt: string
}

export interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverUrl: string | null
  category: string
  authorName: string
  published: boolean
  createdAt: string
}
