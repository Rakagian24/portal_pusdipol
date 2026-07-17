<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_articles_cache', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_id')->constrained('journals')->cascadeOnDelete();
            $table->string('ojs_article_id');
            $table->string('title');
            $table->string('authors');
            $table->text('abstract')->nullable();
            $table->string('issue_volume')->nullable();
            $table->string('doi')->nullable();
            $table->string('pdf_url')->nullable();
            $table->date('published_date')->nullable();
            $table->dateTime('synced_at')->nullable();
            $table->timestamps();

            $table->unique(['journal_id', 'ojs_article_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_articles_cache');
    }
};
