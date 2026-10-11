package com.churrascocalculado.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "churrasco_events")
data class ChurrascoEventEntity(
    @PrimaryKey val id: String,
    val name: String,
    val dateEpochMs: Long,
    val adults: Int,
    val children: Int,
    val durationHours: Int,
    val profile: String,
    val totalMeatKg: Double,
    val totalCostCalculated: Double
)

@Dao
interface ChurrascoDao {
    @Query("SELECT * FROM churrasco_events ORDER BY dateEpochMs DESC")
    fun getAllEvents(): Flow<List<ChurrascoEventEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: ChurrascoEventEntity)

    @Query("DELETE FROM churrasco_events WHERE id = :id")
    suspend fun deleteEventById(id: String)
}

@Database(entities = [ChurrascoEventEntity::class], version = 1, exportSchema = false)
abstract class ChurrascoDatabase : RoomDatabase() {
    abstract fun churrascoDao(): ChurrascoDao
}
