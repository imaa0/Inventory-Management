<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'quantity',
        'unit',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
    ];

    public function transactions()
    {
        return $this->hasMany(InventoryTransaction::class)->orderBy('created_at', 'desc');
    }

    public function addStock($quantity, $userId, $notes = null)
    {
        $this->increment('quantity', $quantity);
        
        return $this->transactions()->create([
            'user_id' => $userId,
            'type' => 'addition',
            'quantity' => $quantity,
            'notes' => $notes,
        ]);
    }

    public function deductStock($quantity, $userId, $notes = null)
    {
        if ($this->quantity < $quantity) {
            throw new \Exception('Insufficient stock');
        }

        $this->decrement('quantity', $quantity);
        
        return $this->transactions()->create([
            'user_id' => $userId,
            'type' => 'deduction',
            'quantity' => $quantity,
            'notes' => $notes,
        ]);
    }
}
