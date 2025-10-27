import { useState } from "react"
import { UserPlus, Lock, Unlock, Search, X, ShieldCheck, ShieldOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface User {
  id: number
  name: string
  email: string
  role: string
  isBlocked: boolean
  has2FA: boolean
  createdAt: string
}

export function AdminDashboard() {
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newUserRole, setNewUserRole] = useState("Utilisateur")

  // TODO: Remplacer par les vraies données
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Jean Dupont",
      email: "jean.dupont@exemple.com",
      role: "Utilisateur",
      isBlocked: false,
      has2FA: true,
      createdAt: "15 janvier 2025"
    },
    {
      id: 2,
      name: "Marie Martin",
      email: "marie.martin@exemple.com",
      role: "Utilisateur",
      isBlocked: false,
      has2FA: false,
      createdAt: "20 janvier 2025"
    },
    {
      id: 3,
      name: "Pierre Durand",
      email: "pierre.durand@exemple.com",
      role: "Admin",
      isBlocked: false,
      has2FA: true,
      createdAt: "10 janvier 2025"
    },
    {
      id: 4,
      name: "Sophie Bernard",
      email: "sophie.bernard@exemple.com",
      role: "Utilisateur",
      isBlocked: true,
      has2FA: false,
      createdAt: "5 janvier 2025"
    }
  ])

  const handleToggleBlock = (userId: number) => {
    // TODO: Implémenter la logique de blocage/déblocage via l'API
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
    ))

    const user = users.find(u => u.id === userId)
    if (user) {
      alert(user.isBlocked
        ? `Compte de ${user.name} débloqué`
        : `Compte de ${user.name} bloqué`)
    }
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implémenter l'ajout d'utilisateur via l'API
    const newUser: User = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      isBlocked: false,
      has2FA: false,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    setUsers([...users, newUser])
    setShowAddUserForm(false)
    setNewUserName("")
    setNewUserEmail("")
    setNewUserPassword("")
    setNewUserRole("Utilisateur")

    alert(`Compte créé pour ${newUserName}`)
  }

  const handleCancelAddUser = () => {
    setShowAddUserForm(false)
    setNewUserName("")
    setNewUserEmail("")
    setNewUserPassword("")
    setNewUserRole("Utilisateur")
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
            <p className="text-muted-foreground">
              Gérez les utilisateurs et leurs accès
            </p>
          </div>
          {!showAddUserForm && (
            <Button onClick={() => setShowAddUserForm(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          )}
        </div>

        {showAddUserForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Créer un nouveau compte</CardTitle>
              <CardDescription>
                Ajoutez un nouvel utilisateur à la plateforme
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAddUser}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newName">Nom complet</Label>
                    <Input
                      id="newName"
                      type="text"
                      placeholder="Jean Dupont"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newEmail">Email</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      placeholder="utilisateur@exemple.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newRole">Rôle</Label>
                    <select
                      id="newRole"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <option value="Utilisateur">Utilisateur</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={handleCancelAddUser}
                  >
                    <X className="h-4 w-4" />
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 gap-2">
                    <UserPlus className="h-4 w-4" />
                    Créer le compte
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Liste de tous les utilisateurs de la plateforme
                </CardDescription>
              </div>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Rôle
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      A2F
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                      Créé le
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <p className="font-medium">{user.name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {user.isBlocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              <Lock className="h-3 w-3" />
                              Bloqué
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                              <Unlock className="h-3 w-3" />
                              Actif
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {user.has2FA ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                              <ShieldCheck className="h-3 w-3" />
                              Activé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              <ShieldOff className="h-3 w-3" />
                              Désactivé
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted-foreground">{user.createdAt}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            variant={user.isBlocked ? "default" : "destructive"}
                            size="sm"
                            className="gap-2"
                            onClick={() => handleToggleBlock(user.id)}
                          >
                            {user.isBlocked ? (
                              <>
                                <Unlock className="h-3 w-3" />
                                Débloquer
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3" />
                                Bloquer
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
