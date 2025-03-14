"use client"

import { useState, useEffect } from "react"
import {getUsers, type User} from "@/enteties/admin/get-all-users";
import {SearchBar} from "@/features/users/ui/search-bar";
import {Filters} from "@/features/users/ui/filters";
import {UsersTable} from "@/features/users/ui/users-table";
import {formatDate} from "@/features/users/actions/date-formatter";
import {UsersCards} from "@/features/users/ui/user-cards";



export default function Users() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    // Filter states
    const [balanceSort, setBalanceSort] = useState<"asc" | "desc" | null>(null)
    const [registrationSort, setRegistrationSort] = useState<"asc" | "desc" | null>(null)
    const [lastLoginSort, setLastLoginSort] = useState<"asc" | "desc" | null>(null)

    // Date range filters
    const [registrationDateStart, setRegistrationDateStart] = useState("")
    const [registrationDateEnd, setRegistrationDateEnd] = useState("")
    const [lastLoginDateStart, setLastLoginDateStart] = useState("")
    const [lastLoginDateEnd, setLastLoginDateEnd] = useState("")

    // Balance range filter
    const [balanceMin, setBalanceMin] = useState("")
    const [balanceMax, setBalanceMax] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const response = await getUsers()
                if (response.success && response.users) {
                    setUsers(response.users)
                    setFilteredUsers(response.users)
                } else {
                    setError(response.message)
                }
            } catch (error) {
                setError("Ошибка при загрузке пользователей")
                console.error("Error fetching users:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    useEffect(() => {
        let result = [...users]

        // Apply search filter
        if (searchTerm) {
            result = result.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.user_id.toString().includes(searchTerm),
            )
        }

        // Apply balance range filter
        if (balanceMin !== "") {
            result = result.filter((user) => user.balance >= Number.parseFloat(balanceMin))
        }

        if (balanceMax !== "") {
            result = result.filter((user) => user.balance <= Number.parseFloat(balanceMax))
        }

        // Apply registration date range filter
        if (registrationDateStart) {
            // Делим на 1000, т.к. в базе данных время в секундах, а JavaScript работает с миллисекундами
            const startDate = new Date(registrationDateStart).getTime() / 1000
            result = result.filter((user) => user.create_date >= startDate)
        }

        if (registrationDateEnd) {
            // Делим на 1000, т.к. в базе данных время в секундах, а JavaScript работает с миллисекундами
            const endDate = new Date(registrationDateEnd).getTime() / 1000 + 86400 // End of day
            result = result.filter((user) => user.create_date <= endDate)
        }

        // Apply last login date range filter
        if (lastLoginDateStart) {
            // Делим на 1000, т.к. в базе данных время в секундах, а JavaScript работает с миллисекундами
            const startDate = new Date(lastLoginDateStart).getTime() / 1000
            result = result.filter((user) => user.last_auth >= startDate)
        }

        if (lastLoginDateEnd) {
            // Делим на 1000, т.к. в базе данных время в секундах, а JavaScript работает с миллисекундами
            const endDate = new Date(lastLoginDateEnd).getTime() / 1000 + 86400 // End of day
            result = result.filter((user) => user.last_auth <= endDate)
        }

        // Apply sorts
        if (balanceSort) {
            result.sort((a, b) => {
                return balanceSort === "asc" ? a.balance - b.balance : b.balance - a.balance
            })
        }

        if (registrationSort) {
            result.sort((a, b) => {
                return registrationSort === "asc" ? a.create_date - b.create_date : b.create_date - a.create_date
            })
        }

        if (lastLoginSort) {
            result.sort((a, b) => {
                return lastLoginSort === "asc" ? a.last_auth - b.last_auth : b.last_auth - a.last_auth
            })
        }

        setFilteredUsers(result)
    }, [
        users,
        searchTerm,
        balanceSort,
        registrationSort,
        lastLoginSort,
        balanceMin,
        balanceMax,
        registrationDateStart,
        registrationDateEnd,
        lastLoginDateStart,
        lastLoginDateEnd,
    ])

    const toggleBalanceSort = () => {
        if (balanceSort === null) setBalanceSort("desc")
        else if (balanceSort === "desc") setBalanceSort("asc")
        else setBalanceSort(null)

        // Reset other sorts
        setRegistrationSort(null)
        setLastLoginSort(null)
    }

    const toggleRegistrationSort = () => {
        if (registrationSort === null) setRegistrationSort("desc")
        else if (registrationSort === "desc") setRegistrationSort("asc")
        else setRegistrationSort(null)

        // Reset other sorts
        setBalanceSort(null)
        setLastLoginSort(null)
    }

    const toggleLastLoginSort = () => {
        if (lastLoginSort === null) setLastLoginSort("desc")
        else if (lastLoginSort === "desc") setLastLoginSort("asc")
        else setLastLoginSort(null)

        // Reset other sorts
        setBalanceSort(null)
        setRegistrationSort(null)
    }

    const resetFilters = () => {
        setSearchTerm("")
        setBalanceSort(null)
        setRegistrationSort(null)
        setLastLoginSort(null)
        setBalanceMin("")
        setBalanceMax("")
        setRegistrationDateStart("")
        setRegistrationDateEnd("")
        setLastLoginDateStart("")
        setLastLoginDateEnd("")
    }

    if (loading) {
        return <div className="text-center py-8">Загрузка...</div>
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>
    }

    return (
        <div className="container mx-auto py-6">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <Filters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                balanceSort={balanceSort}
                registrationSort={registrationSort}
                lastLoginSort={lastLoginSort}
                balanceMin={balanceMin}
                balanceMax={balanceMax}
                registrationDateStart={registrationDateStart}
                registrationDateEnd={registrationDateEnd}
                lastLoginDateStart={lastLoginDateStart}
                lastLoginDateEnd={lastLoginDateEnd}
                setBalanceMin={setBalanceMin}
                setBalanceMax={setBalanceMax}
                setRegistrationDateStart={setRegistrationDateStart}
                setRegistrationDateEnd={setRegistrationDateEnd}
                setLastLoginDateStart={setLastLoginDateStart}
                setLastLoginDateEnd={setLastLoginDateEnd}
                toggleBalanceSort={toggleBalanceSort}
                toggleRegistrationSort={toggleRegistrationSort}
                toggleLastLoginSort={toggleLastLoginSort}
                resetFilters={resetFilters}
            />

            <UsersTable
                users={filteredUsers}
                formatDate={formatDate}
                balanceSort={balanceSort}
                registrationSort={registrationSort}
                lastLoginSort={lastLoginSort}
                toggleBalanceSort={toggleBalanceSort}
                toggleRegistrationSort={toggleRegistrationSort}
                toggleLastLoginSort={toggleLastLoginSort}
            />

            <UsersCards users={filteredUsers} formatDate={formatDate} />
        </div>
    )
}

