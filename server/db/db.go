package supabase

import (
	"log"
	"os"
	"sync"

	"github.com/supabase-community/supabase-go"
)

var (
	client *supabase.Client
	once   sync.Once
)

func GetClient() *supabase.Client {
	once.Do(func() {
		var err error
		client, err = connectDb()
		if err != nil {
			log.Fatalf("Failed to initialize Supabase client: %v \n", err)
		}
	})
	return client
}

func connectDb() (db *supabase.Client, err error) {
	SUPABASE_URL := os.Getenv("SUPABASE_URL")
	SUPABASE_ANON_KEY := os.Getenv("SUPABASE_ANON_KEY")

	db, err = supabase.NewClient(SUPABASE_URL, SUPABASE_ANON_KEY, nil)
	if err != nil {
		return nil, err
	}

	return db, nil

}
