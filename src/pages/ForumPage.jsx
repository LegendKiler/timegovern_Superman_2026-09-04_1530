import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from '../context/UserContext'
import { setPageMeta } from '../lib/seo';
import HubExtras from '../components/HubExtras';

const initialPosts = [
  { id: 1, title: "Welcome to TimeGovern Forum!", author: "admin", content: "Feel free to discuss time-related topics." },
  { id: 2, title: "DST transitions", author: "time_lover", content: "Does anyone know when DST starts in Europe?" }
]

export default function ForumPage() {

  useEffect(() => {
    document.title = 'Forum | TimeGovern';
    setPageMeta();
  }, []);
  const [posts, setPosts] = useState(initialPosts)
  const [newPost, setNewPost] = useState('')
  const { user } = useUser()

  const addPost = () => {
    if (!newPost.trim()) return
    setPosts([...posts, { id: Date.now(), title: newPost, author: user?.username || 'Guest', content: '' }])
    setNewPost('')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Community Forum</h1>
      <Card>
        <CardHeader><CardTitle>Community Forum</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {posts.map(post => (
              <div key={post.id} className="border rounded p-3">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.content}</p>
                <p className="text-xs text-muted-foreground mt-1">Posted by {post.author}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Start a new topic..." />
            <Button onClick={addPost}>Post</Button>
          </div>
        </CardContent>
      </Card>
    <HubExtras category="community" />
      </div>
  )
}