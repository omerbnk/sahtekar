/*
 * Sahtekâr — kelime ve ipucu verisi
 *
 * Her satır:  Kelime: ipucu, ipucu, ipucu
 * İpuçları aynı kategorideki başka kelimelerle de paylaşılmalı; böylece
 * sahtekâra verilen ipucu kelimeyi ele vermez, sadece yön gösterir.
 * Oyun hangi ipucunun kaç kelimede geçtiğini kendisi hesaplar:
 *   Zor    -> en çok paylaşılan ipucu
 *   Normal -> paylaşılanlara ağırlık veren rastgele seçim
 *   Kolay  -> en az paylaşılan iki ipucu
 */
window.SK_DATA = [
{ad:"Yiyecek", emoji:"🍕", renk:"#ff8a3d,#5a2a12,#25100a", font:"Fredoka", kalinlik:700, kose:44,
 susler:"🍕 🍔 🍩 🍉 🥐 🍝", not:"Bu turun menüsü", kelimeler:`
Pizza: Fırında pişer, Hamurlu, İtalyan mutfağı, Paylaşılır, Dilim dilim, Peynirli
Lahmacun: Fırında pişer, Hamurlu, Etli, Acılı, Sokakta yenir
Pide: Fırında pişer, Hamurlu, Etli, Peynirli, Paylaşılır
Mantı: Hamurlu, Etli, Ev yemeği, Sıcak, Yoğurtlu
Makarna: Hamurlu, İtalyan mutfağı, Ev yemeği, Sıcak, Çocukların sevdiği
Tiramisu: Tatlı, İtalyan mutfağı, Soğuk, Sütlü
Baklava: Tatlı, Şerbetli, Bayramlarda, Hamurlu, Fırında pişer
Künefe: Tatlı, Şerbetli, Peynirli, Sıcak
Sütlaç: Tatlı, Sütlü, Fırında pişer, Soğuk
Dondurma: Tatlı, Soğuk, Yazın, Sütlü, Çocukların sevdiği
Çikolata: Tatlı, Çocukların sevdiği, Sütlü, Misafire ikram
Lokum: Tatlı, Misafire ikram, Bayramlarda
Pasta: Tatlı, Dilim dilim, Sütlü, Paylaşılır, Kutlamalarda
Simit: Hamurlu, Sokakta yenir, Kahvaltılık, Fırında pişer
Poğaça: Hamurlu, Kahvaltılık, Fırında pişer, Peynirli
Börek: Hamurlu, Kahvaltılık, Peynirli, Fırında pişer, Misafire ikram
Gözleme: Hamurlu, Peynirli, Kahvaltılık, Sıcak
Menemen: Kahvaltılık, Sebzeli, Sıcak, Ev yemeği, Ekmekle
Döner: Etli, Sokakta yenir, Ekmekle, Fast food
Hamburger: Etli, Fast food, Ekmekle, Çocukların sevdiği
Kebap: Etli, Acılı, Sıcak, Paylaşılır
Köfte: Etli, Ev yemeği, Ekmekle, Çocukların sevdiği
Kokoreç: Sokakta yenir, Etli, Acılı, Ekmekle
İçli köfte: Kızartma, Etli, Misafire ikram
Mercimek çorbası: Sıcak, Kışın, Ev yemeği, Sarı
Pilav: Ev yemeği, Sıcak, Yoğurtlu
Turşu: Ekşi, Sebzeli, Kışın, Ev yemeği
Patates kızartması: Kızartma, Fast food, Çocukların sevdiği, Sarı
Sushi: Uzak Doğu, Soğuk, Paylaşılır
Noodle: Uzak Doğu, Hamurlu, Sıcak, Acılı
Kumpir: Sokakta yenir, Peynirli, Sıcak, Fırında pişer
Midye dolma: Sokakta yenir, Kabuklu, Paylaşılır
Pamuk şeker: Tatlı, Çocukların sevdiği, Sokakta yenir
Karpuz: Meyve, Yazın, Çekirdekli, Dilim dilim, Kabuklu
Elma: Meyve, Çekirdekli, Kabuklu
Muz: Meyve, Sarı, Kabuklu, Kahvaltılık
Limon: Meyve, Sarı, Kabuklu, Ekşi
Mısır: Sarı, Sokakta yenir, Sebzeli, Yazın
Çay: İçecek, Sıcak, Kahvaltılık, Misafire ikram
Türk kahvesi: İçecek, Sıcak, Köpüklü, Misafire ikram
Ayran: İçecek, Soğuk, Köpüklü, Yazın, Ekşi
Limonata: İçecek, Soğuk, Yazın, Ekşi
`},
{ad:"Hayvanlar", emoji:"🦁", renk:"#8bd450,#2d4a1a,#12200a", font:"Baloo 2", kalinlik:800, kose:36,
 susler:"🦁 🐧 🐘 🦒 🐢 🦉", not:"Bu turun yaratığı", kelimeler:`
Aslan: Yırtıcı, Sürüyle yaşar, Afrika'da, Tüylü
Kaplan: Yırtıcı, Çizgili, Asya'da, Ormanda
Çita: Yırtıcı, Hızlı, Afrika'da, Benekli
Zebra: Çizgili, Afrika'da, Sürüyle yaşar, Otçul
Zürafa: Afrika'da, Otçul, Dev, Benekli
Fil: Dev, Otçul, Afrika'da, Zeki, Sürüyle yaşar
Kurt: Yırtıcı, Sürüyle yaşar, Gece aktif, Ormanda
Ayı: Yırtıcı, Ormanda, Dev, Tüylü
Kutup ayısı: Soğuğu sever, Yırtıcı, Dev, Tüylü
Tilki: Ormanda, Gece aktif, Zeki, Tüylü
Sincap: Ormanda, Küçük, Tüylü, Uzun kuyruklu
Panda: Asya'da, Otçul, Ormanda, Tüylü
Maymun: Ormanda, Tropik, Zeki, Uzun kuyruklu
Kedi: Evcil, Gece aktif, Küçük, Tüylü
Köpek: Evcil, Tüylü, Zeki, Hızlı
Tavşan: Evcil, Küçük, Otçul, Hızlı, Tüylü
Fare: Küçük, Gece aktif, Uzun kuyruklu
At: Evcil, Otçul, Hızlı, Çiftlik hayvanı
İnek: Çiftlik hayvanı, Otçul, Sürüyle yaşar, Benekli
Koyun: Çiftlik hayvanı, Otçul, Sürüyle yaşar, Tüylü
Tavuk: Kuş, Çiftlik hayvanı, Evcil
Deve: Otçul, Dev, Çölde yaşar
Penguen: Kuş, Soğuğu sever, Suda yaşar, Sürüyle yaşar
Kartal: Kuş, Yırtıcı, Uçar, Hızlı
Baykuş: Kuş, Gece aktif, Yırtıcı, Uçar
Papağan: Kuş, Renkli, Tropik, Zeki, Uçar
Flamingo: Kuş, Renkli, Sürüyle yaşar, Suda yaşar
Yunus: Suda yaşar, Zeki, Sürüyle yaşar, Hızlı
Köpekbalığı: Suda yaşar, Yırtıcı, Dev, Hızlı
Balina: Suda yaşar, Dev, Soğuğu sever
Ahtapot: Suda yaşar, Zeki, Renkli
Timsah: Sürüngen, Suda yaşar, Yırtıcı, Tropik
Kaplumbağa: Yavaş, Kabuklu, Suda yaşar, Sürüngen
Bukalemun: Sürüngen, Renkli, Tropik, Yavaş
Yılan: Sürüngen, Zehirli, Çölde yaşar
Akrep: Zehirli, Çölde yaşar, Küçük, Gece aktif
Salyangoz: Yavaş, Kabuklu, Küçük, Gece aktif
Karınca: Böcek, Küçük, Sürüyle yaşar
Arı: Böcek, Uçar, Sürüyle yaşar, Zehirli
Kelebek: Böcek, Uçar, Renkli, Küçük
`},
{ad:"Şehirler", emoji:"🌍", renk:"#3db8ff,#143d66,#0a1a30", font:"Playfair Display", kalinlik:800, kose:16,
 susler:"🗼 🗽 🏰 🧭 🌐 🗺", not:"Bu turun durağı", kelimeler:`
İstanbul: Türkiye'de, Sahil, Tarihî, Kalabalık, Futbol
Ankara: Türkiye'de, Başkent, Kalabalık
İzmir: Türkiye'de, Sahil, Kalabalık, Yaz tatili
Antalya: Türkiye'de, Sahil, Yaz tatili, Turistik
Bodrum: Türkiye'de, Sahil, Yaz tatili, Turistik
Bursa: Türkiye'de, Tarihî, Kayak, Dağlık
Erzurum: Türkiye'de, Kayak, Dağlık, Soğuk
Trabzon: Türkiye'de, Sahil, Yağmurlu, Dağlık, Futbol
Rize: Türkiye'de, Yağmurlu, Dağlık, Sahil
Kapadokya: Türkiye'de, Turistik, Tarihî, Romantik
Mardin: Türkiye'de, Tarihî, Turistik
Paris: Avrupa'da, Başkent, Romantik, Turistik
Roma: Avrupa'da, Başkent, Tarihî, Turistik
Atina: Avrupa'da, Başkent, Tarihî, Sahil
Prag: Avrupa'da, Başkent, Tarihî, Romantik
Venedik: Avrupa'da, Kanallar, Romantik, Turistik
Amsterdam: Avrupa'da, Başkent, Kanallar, Turistik
Londra: Avrupa'da, Başkent, Yağmurlu, Kalabalık, Futbol
Barselona: Avrupa'da, Sahil, Futbol, Turistik
Moskova: Avrupa'da, Başkent, Kalabalık, Soğuk
İzlanda: Avrupa'da, Ada, Soğuk
New York: Amerika'da, Kalabalık, Gökdelen, Turistik
Los Angeles: Amerika'da, Sahil, Kalabalık
Rio de Janeiro: Amerika'da, Sahil, Futbol, Tropik
Tokyo: Asya'da, Başkent, Modern, Kalabalık, Gökdelen
Pekin: Asya'da, Başkent, Kalabalık, Tarihî
Singapur: Asya'da, Modern, Gökdelen, Ada, Tropik
Dubai: Asya'da, Çöl, Gökdelen, Modern
Bali: Asya'da, Ada, Yaz tatili, Tropik
Maldivler: Asya'da, Ada, Tropik, Romantik
Kahire: Afrika'da, Çöl, Tarihî, Başkent, Kalabalık
Marakeş: Afrika'da, Çöl, Turistik, Tarihî
Sidney: Sahil, Modern, Gökdelen
`},
{ad:"Meslekler", emoji:"🧑‍🍳", renk:"#ffc83d,#5a4412,#241a08", font:"Archivo Black", kalinlik:400, kose:10,
 susler:"🩺 🔧 🚒 🎨 ✏ 🧰", not:"Bu turun mesleği", kelimeler:`
Doktor: Hastanede, Beyaz önlüklü, Gece çalışır
Hemşire: Hastanede, Beyaz önlüklü, Gece çalışır, Üniformalı
Diş hekimi: Beyaz önlüklü, Alet kullanır, Muayenehanede
Veteriner: Hayvanlarla, Beyaz önlüklü, Muayenehanede
Eczacı: Beyaz önlüklü, Dükkânı var, Müşteriye hizmet
Pilot: Gökyüzünde, Üniformalı, Seyahat eder, Riskli
Hostes: Gökyüzünde, Üniformalı, Seyahat eder, Müşteriye hizmet
Astronot: Gökyüzünde, Riskli, Seyahat eder
Kaptan: Denizde, Üniformalı, Seyahat eder
Balıkçı: Denizde, Açık havada, Sabah erken
Polis: Üniformalı, Gece çalışır, Riskli
İtfaiyeci: Üniformalı, Riskli, Gece çalışır, Alet kullanır
Asker: Üniformalı, Riskli, Açık havada
Aşçı: Mutfakta, Yaratıcı, Beyaz önlüklü
Fırıncı: Mutfakta, Sabah erken, Dükkânı var
Garson: Müşteriye hizmet, Gece çalışır, Ayakta çalışır
Berber: Dükkânı var, Alet kullanır, Müşteriye hizmet
Kuaför: Dükkânı var, Müşteriye hizmet, Alet kullanır, Yaratıcı
Kasap: Dükkânı var, Alet kullanır, Sabah erken
Öğretmen: Çocuklarla, Sabah erken, Kalabalığa karşı
Avukat: Adliyede, Ofiste, Cübbeli
Hakim: Adliyede, Cübbeli, Karar verir
Mimar: Ofiste, Yaratıcı, Bilgisayarla, Çizim yapar
Yazılımcı: Bilgisayarla, Ofiste, Gece çalışır
Ressam: Yaratıcı, Çizim yapar, Alet kullanır
Şarkıcı: Sahnede, Kalabalığa karşı, Yaratıcı, Gece çalışır
Oyuncu: Sahnede, Kamerayla, Yaratıcı
Sihirbaz: Sahnede, Kalabalığa karşı, Çocuklarla
Palyaço: Sahnede, Çocuklarla, Yaratıcı
YouTuber: Kamerayla, Bilgisayarla, Yaratıcı
Fotoğrafçı: Kamerayla, Yaratıcı, Seyahat eder
Gazeteci: Kamerayla, Seyahat eder, Bilgisayarla
Çiftçi: Açık havada, Sabah erken, Hayvanlarla
Futbol hakemi: Açık havada, Kalabalığa karşı, Üniformalı, Karar verir
Taksici: Direksiyonda, Gece çalışır, Müşteriye hizmet
Otobüs şoförü: Direksiyonda, Sabah erken, Kalabalığa karşı
Kurye: Direksiyonda, Açık havada, Müşteriye hizmet
`},
{ad:"Eşyalar", emoji:"🔑", renk:"#c58bff,#44286b,#1a1030", font:"Space Grotesk", kalinlik:700, kose:24,
 susler:"🔑 🕯 🕶 🎒 🧲 🔔", not:"Bu turun eşyası", kelimeler:`
Telefon: Cepte taşınır, Elektrikli, Ekranlı, Şarjlı
Anahtar: Cepte taşınır, Metal, Küçük
Cüzdan: Cepte taşınır, Her gün kullanılır
Çakmak: Cepte taşınır, Küçük, Isıtır
Gözlük: Camlı, Her gün kullanılır, Küçük
Kol saati: Zamanla ilgili, Her gün kullanılır, Metal, Küçük
Çalar saat: Zamanla ilgili, Sabah kullanılır, Evde
Şemsiye: Metal, Kumaştan, Yağmurda
Ayna: Camlı, Banyoda, Sabah kullanılır
Diş fırçası: Banyoda, Plastik, Sabah kullanılır, Her gün kullanılır
Havlu: Banyoda, Kumaştan, Yağmurda
Saç kurutma makinesi: Elektrikli, Isıtır, Banyoda
Çamaşır makinesi: Elektrikli, Büyük, Banyoda
Yastık: Yatakta, Kumaştan, Gece kullanılır
Battaniye: Yatakta, Kumaştan, Gece kullanılır, Isıtır
Buzdolabı: Mutfakta, Elektrikli, Büyük
Çaydanlık: Mutfakta, Metal, Isıtır
Tava: Mutfakta, Metal, Isıtır
Bardak: Camlı, Mutfakta, Her gün kullanılır
Bıçak: Kesici, Metal, Mutfakta
Makas: Kesici, Metal, Okulda
Kalem: Okulda, Küçük, Cepte taşınır
Silgi: Okulda, Küçük, Plastik
Defter: Okulda, Kâğıttan
Kitap: Kâğıttan, Okulda
Gazete: Kâğıttan, Sabah kullanılır
Sırt çantası: Okulda, Kumaştan, Her gün kullanılır
Şarj aleti: Elektrikli, Küçük, Plastik
Kulaklık: Elektrikli, Şarjlı, Cepte taşınır
Televizyon: Elektrikli, Ekranlı, Büyük, Evde
Bilgisayar: Elektrikli, Ekranlı, Şarjlı
Kumanda: Plastik, Evde, Küçük
Ütü: Elektrikli, Isıtır, Evde
Süpürge: Elektrikli, Evde, Büyük
Mum: Işık verir, Gece kullanılır, Isıtır
Lamba: Işık verir, Elektrikli, Evde
El feneri: Işık verir, Şarjlı, Gece kullanılır
Parfüm: Camlı, Küçük, Sabah kullanılır
Terlik: Evde, Her gün kullanılır, Plastik
`},
{ad:"Sporlar", emoji:"🏀", renk:"#ff4d6d,#5c1426,#25080f", font:"Anton", kalinlik:400, kose:6,
 susler:"🏀 🎾 🥊 🏐 🏊 🥇", not:"Bu turun sporu", kelimeler:`
Futbol: Toplu, Takım sporu, Açık havada, Olimpik
Basketbol: Toplu, Takım sporu, Salonda, Olimpik
Voleybol: Toplu, Takım sporu, Fileli, Salonda, Olimpik
Hentbol: Toplu, Takım sporu, Salonda, Olimpik
Rugby: Toplu, Takım sporu, Açık havada, Güç ister
Beyzbol: Toplu, Takım sporu, Açık havada, Eldivenli
Su topu: Toplu, Takım sporu, Suda, Olimpik
Buz hokeyi: Kış sporu, Takım sporu, Hızlı, Kasklı
Tenis: Toplu, Raketli, Fileli, Bireysel
Masa tenisi: Toplu, Raketli, Fileli, Salonda
Badminton: Raketli, Fileli, Salonda, Bireysel
Golf: Toplu, Bireysel, Açık havada, Hedefe nişan
Bilardo: Toplu, Hedefe nişan, Salonda
Bowling: Toplu, Hedefe nişan, Salonda
Dart: Hedefe nişan, Salonda, Bireysel
Okçuluk: Hedefe nişan, Bireysel, Olimpik
Satranç: Zekâ, Bireysel
Yüzme: Suda, Bireysel, Olimpik, Dayanıklılık
Dalış: Suda, Bireysel, Olimpik
Sörf: Suda, Açık havada, Bireysel
Kayak: Kış sporu, Bireysel, Hızlı, Açık havada
Snowboard: Kış sporu, Bireysel, Hızlı, Olimpik
Boks: Ringde, Eldivenli, Bireysel, Güç ister
Kick boks: Ringde, Eldivenli, Bireysel
Güreş: Minderde, Güç ister, Bireysel, Olimpik
Judo: Minderde, Bireysel, Olimpik
Halter: Güç ister, Bireysel, Olimpik
Eskrim: Bireysel, Olimpik, Hızlı
Bisiklet: Tekerlekli, Dayanıklılık, Açık havada, Kasklı
Formula 1: Tekerlekli, Hızlı, Kasklı
Kaykay: Tekerlekli, Kasklı, Bireysel
Maraton: Dayanıklılık, Açık havada, Bireysel
Tırmanış: Güç ister, Açık havada, Dayanıklılık
`},
{ad:"Futbolcular", emoji:"⚽", renk:"#3ddc84,#14502a,#08200f", font:"Barlow Condensed", kalinlik:700, kose:12,
 susler:"⚽ 🥅 👟 🏆 🧤 🟨", not:"Bu turun yıldızı", kelimeler:`
Lionel Messi: Arjantinli, On numara, Sol ayaklı, Barcelona'da oynadı, Altın Top kazandı, Dünya Kupası şampiyonu
Cristiano Ronaldo: Portekizli, Golcü, Real Madrid'de oynadı, Kaptan, Premier Lig, Altın Top kazandı
Ronaldo Nazário: Brezilyalı, Golcü, Efsane, Real Madrid'de oynadı, Barcelona'da oynadı, Dünya Kupası şampiyonu
Neymar: Brezilyalı, On numara, Dribling ustası, Barcelona'da oynadı
Vinícius Júnior: Brezilyalı, Dribling ustası, Real Madrid'de oynadı
Pelé: Brezilyalı, Efsane, On numara, Dünya Kupası şampiyonu
Ronaldinho: Brezilyalı, On numara, Dribling ustası, Barcelona'da oynadı, Altın Top kazandı
Kaká: Brezilyalı, Orta saha, Altın Top kazandı, Real Madrid'de oynadı
Maradona: Arjantinli, Efsane, On numara, Sol ayaklı, Dünya Kupası şampiyonu
Mauro Icardi: Arjantinli, Golcü, Galatasaray'da oynadı
Zidane: Fransız, Orta saha, Real Madrid'de oynadı, Teknik direktör oldu, Dünya Kupası şampiyonu
Mbappé: Fransız, Golcü, Real Madrid'de oynadı, Dünya Kupası şampiyonu, Hızlı
Thierry Henry: Fransız, Golcü, Premier Lig, Dünya Kupası şampiyonu, Hızlı
Haaland: Golcü, Premier Lig, Bundesliga
Lewandowski: Golcü, Bundesliga, Barcelona'da oynadı, Kaptan
Modrić: Orta saha, Real Madrid'de oynadı, Kaptan, Altın Top kazandı
De Bruyne: Orta saha, Premier Lig, Bundesliga, Asist kralı
Salah: Premier Lig, Golcü, Sol ayaklı, Afrikalı, Hızlı
Didier Drogba: Afrikalı, Golcü, Premier Lig, Galatasaray'da oynadı
Victor Osimhen: Afrikalı, Golcü, Galatasaray'da oynadı
Zlatan: Golcü, Premier Lig, Barcelona'da oynadı
Luis Suárez: Golcü, Barcelona'da oynadı, Premier Lig
Edin Džeko: Golcü, Fenerbahçe'de oynadı, Premier Lig, Bundesliga
Buffon: Kaleci, Efsane, Kaptan, Dünya Kupası şampiyonu
Neuer: Kaleci, Bundesliga, Kaptan, Dünya Kupası şampiyonu
Muslera: Kaleci, Galatasaray'da oynadı, Kaptan
Iniesta: İspanyol, Orta saha, Barcelona'da oynadı, Asist kralı, Dünya Kupası şampiyonu
Xavi: İspanyol, Orta saha, Barcelona'da oynadı, Teknik direktör oldu, Dünya Kupası şampiyonu
Cruyff: Hollandalı, Efsane, Barcelona'da oynadı, Teknik direktör oldu
Wesley Sneijder: Hollandalı, Orta saha, Galatasaray'da oynadı, Real Madrid'de oynadı
Beckham: İngiliz, Orta saha, Frikik ustası, Kaptan, Real Madrid'de oynadı, Premier Lig
Rooney: İngiliz, Golcü, Premier Lig, Kaptan
Quaresma: Portekizli, Dribling ustası, Beşiktaş'ta oynadı, Barcelona'da oynadı
Gheorghe Hagi: Efsane, On numara, Sol ayaklı, Galatasaray'da oynadı, Real Madrid'de oynadı, Barcelona'da oynadı
Alex de Souza: Brezilyalı, On numara, Fenerbahçe'de oynadı, Frikik ustası
Mesut Özil: Orta saha, Asist kralı, Premier Lig, Real Madrid'de oynadı, Fenerbahçe'de oynadı, Dünya Kupası şampiyonu
Hakan Şükür: Türk, Golcü, Galatasaray'da oynadı, Efsane
Metin Oktay: Türk, Golcü, Galatasaray'da oynadı, Efsane
Arda Turan: Türk, Orta saha, Galatasaray'da oynadı, Barcelona'da oynadı
Burak Yılmaz: Türk, Golcü, Kaptan, Beşiktaş'ta oynadı
Hakan Çalhanoğlu: Türk, Orta saha, Frikik ustası, Bundesliga, Kaptan
Arda Güler: Türk, Orta saha, Real Madrid'de oynadı, Sol ayaklı, Fenerbahçe'de oynadı
Kenan Yıldız: Türk, Dribling ustası, On numara
Rüştü Reçber: Türk, Kaleci, Fenerbahçe'de oynadı, Barcelona'da oynadı
Volkan Demirel: Türk, Kaleci, Fenerbahçe'de oynadı, Kaptan
`},
{ad:"Doğa", emoji:"🌋", renk:"#35e0b8,#0f4a40,#06201c", font:"Fraunces", kalinlik:700, kose:30,
 susler:"🌲 🌋 🌊 🌙 🍄 🌈", not:"Bu turun manzarası", kelimeler:`
Deniz: Su, Mavi, Yazın, Geniş, Dalgalı
Okyanus: Su, Mavi, Geniş, Derin, Dalgalı
Göl: Su, Mavi, Sessiz
Nehir: Su, Akar, Uzun
Şelale: Su, Akar, Yüksek, Güçlü
Ada: Su, Yazın, Kum
Kumsal: Kum, Yazın, Sıcak
Çöl: Sıcak, Geniş, Kum
Gökyüzü: Mavi, Gökyüzünde, Geniş, Gündüz
Dağ: Yüksek, Soğuk, Sessiz
Kanyon: Geniş, Yüksek, Derin
Vadi: Yeşil, Geniş, Sessiz
Orman: Yeşil, Sessiz, Geniş
Ağaç: Yeşil, Yüksek, İlkbahar
Çiçek: Renkli, İlkbahar
Mağara: Karanlık, Sessiz, Yer altı, Derin
Yanardağ: Sıcak, Yüksek, Tehlikeli, Güçlü
Deprem: Tehlikeli, Güçlü, Yer altı
Tsunami: Su, Tehlikeli, Dalgalı, Güçlü
Gökkuşağı: Gökyüzünde, Yağmurla, Renkli
Gün batımı: Gökyüzünde, Renkli, Akşam
Ay: Gökyüzünde, Gece, Beyaz
Güneş: Gökyüzünde, Sıcak, Gündüz
Yıldız: Gökyüzünde, Gece, Uzak
Kuzey ışıkları: Gökyüzünde, Gece, Renkli, Soğuk
Bulut: Gökyüzünde, Beyaz, Yağmurla
Şimşek: Gökyüzünde, Yağmurla, Tehlikeli, Güçlü
Fırtına: Yağmurla, Tehlikeli, Güçlü, Dalgalı
Kar: Beyaz, Soğuk, Kışın
Çığ: Kışın, Tehlikeli, Beyaz, Soğuk
Buzul: Soğuk, Beyaz, Kışın
Sis: Beyaz, Sessiz, Akşam
`},
{ad:"Mekanlar", emoji:"🏛️", renk:"#ff9e7a,#5a2c1e,#22100a", font:"Righteous", kalinlik:400, kose:20,
 susler:"🏥 🎡 🏟 🏨 🎭 ✈", not:"Bu turun mekânı", kelimeler:`
Hastane: Sağlık, Bekleme yapılır, Kalabalık, Gece gündüz açık
Eczane: Sağlık, Gece gündüz açık, Sıra beklenir
Diş kliniği: Sağlık, Bekleme yapılır, Gürültülü
Okul: Çocuklarla dolu, Kalabalık, Gürültülü, Sabah gidilir
Kütüphane: Sessiz olunmalı, Sabah gidilir, Kitaplar
Ofis: Sabah gidilir, Kapalı alan, Bilgisayarlar
Havaalanı: Bilet alınır, Kalabalık, Sıra beklenir, Güvenlik, Tatilde
Otel: Tatilde, Uyunur, Para harcanır, Gece gündüz açık
Kamp alanı: Açık havada, Uyunur, Şehir dışında, Tatilde
Plaj: Açık havada, Tatilde, Su var, Yazın
Yüzme havuzu: Su var, Spor yapılır, Yazın
Hamam: Su var, Sıcak, Rahatlatır
Spor salonu: Spor yapılır, Kapalı alan, Gürültülü
Stadyum: Kalabalık, Gürültülü, Bilet alınır, Açık havada, Spor yapılır
Kayak merkezi: Şehir dışında, Tatilde, Kışın, Spor yapılır
Sinema: Bilet alınır, Karanlık, Sessiz olunmalı, Gece gidilir
Tiyatro: Bilet alınır, Sessiz olunmalı, Gece gidilir, Sahne var
Sirk: Bilet alınır, Çocuklarla dolu, Sahne var, Eğlence, Hayvanlar
Lunapark: Eğlence, Çocuklarla dolu, Bilet alınır, Gürültülü
Hayvanat bahçesi: Çocuklarla dolu, Açık havada, Bilet alınır, Hayvanlar
Müze: Bilet alınır, Sessiz olunmalı, Tarihî
Gece kulübü: Gece gidilir, Gürültülü, Eğlence, Karanlık
Düğün salonu: Gece gidilir, Gürültülü, Yemek yenir, Kalabalık, Eğlence
Restoran: Yemek yenir, Para harcanır, Gece gidilir
Kafe: Yemek yenir, Rahatlatır, Sohbet edilir
Berber: Para harcanır, Bekleme yapılır, Sohbet edilir
Süpermarket: Para harcanır, Sıra beklenir, Kalabalık
Semt pazarı: Açık havada, Kalabalık, Gürültülü, Para harcanır
Banka: Güvenlik, Sıra beklenir, Para harcanır
Benzin istasyonu: Gece gündüz açık, Para harcanır, Şehir dışında
Karakol: Güvenlik, Gece gündüz açık
Hapishane: Güvenlik, Kapalı alan, Uyunur
Metro istasyonu: Kalabalık, Yer altında, Gürültülü
Denizaltı: Kapalı alan, Su var, Yer altında, Karanlık
Çiftlik: Şehir dışında, Açık havada, Hayvanlar
Uzay istasyonu: Kapalı alan, Uyunur, Bilgisayarlar
`},
{ad:"Ulaşım", emoji:"🚌", renk:"#4dd0e1,#11444b,#061c20", font:"Russo One", kalinlik:400, kose:14,
 susler:"🚌 🚲 ✈ 🚂 ⛵ 🚀", not:"Bu turun aracı", kelimeler:`
Otobüs: Tekerlekli, Toplu taşıma, Şehir içi, Büyük
Dolmuş: Tekerlekli, Şehir içi, Toplu taşıma, Motorlu
Metro: Raylı, Toplu taşıma, Şehir içi, Yer altında, Elektrikli
Tramvay: Raylı, Toplu taşıma, Şehir içi, Elektrikli
Hızlı tren: Raylı, Hızlı, Uzun yol, Elektrikli, Bilet alınır
Uçak: Havada, Hızlı, Uzun yol, Bilet alınır, Büyük
Helikopter: Havada, Acil durum, Pervaneli
Roket: Havada, Hızlı, Uzaya gider
Uzay mekiği: Havada, Uzaya gider, Büyük
Sıcak hava balonu: Havada, Yavaş, Turistik, Rüzgârla
Paraşüt: Havada, Rüzgârla, Tek kişilik
Teleferik: Havada, Turistik, Elektrikli, Yavaş
Vapur: Denizde, Toplu taşıma, Şehir içi, Yavaş
Yat: Denizde, Lüks, Turistik
Yelkenli: Denizde, Rüzgârla, Yavaş
Kano: Denizde, Yavaş, Kürekli, Tek kişilik
Gondol: Kürekli, Turistik, Romantik
Denizaltı: Denizde, Büyük, Pervaneli
Bisiklet: Tekerlekli, Pedallı, Tek kişilik
Tandem bisiklet: Tekerlekli, Pedallı, Romantik
Motosiklet: Tekerlekli, Motorlu, Hızlı, Tek kişilik
Elektrikli scooter: Tekerlekli, Elektrikli, Tek kişilik, Şehir içi
Kaykay: Tekerlekli, Tek kişilik, Yavaş
Taksi: Tekerlekli, Şehir içi, Sarı, Motorlu
Ambulans: Tekerlekli, Acil durum, Hızlı, Sirenli
İtfaiye aracı: Tekerlekli, Acil durum, Sirenli, Büyük
Polis arabası: Tekerlekli, Sirenli, Acil durum, Hızlı
Okul servisi: Tekerlekli, Sarı, Şehir içi
Traktör: Tekerlekli, Motorlu, Yavaş
Kamyon: Tekerlekli, Büyük, Uzun yol, Motorlu
Karavan: Tekerlekli, Uzun yol, Büyük
Limuzin: Tekerlekli, Lüks, Motorlu
Fayton: Tekerlekli, Turistik, Yavaş, Atlı
Kızak: Yavaş, Atlı, Tek kişilik
`},
{ad:"Film & Dizi", emoji:"🎬", renk:"#ff6b9d,#5a1832,#220a14", font:"Bebas Neue", kalinlik:400, kose:8,
 susler:"🎬 🍿 🎞 🎥 ⭐ 🎟", not:"Bu turun yapımı", kelimeler:`
Titanic: Film, Romantik, Dram, Gemide geçer
Harry Potter: Film, Fantastik, Büyü, Devam filmleri var, Gençler
Yüzüklerin Efendisi: Film, Fantastik, Büyü, Devam filmleri var, Savaş
Karlar Ülkesi: Film, Animasyon, Büyü, Müzikal
Star Wars: Film, Bilim kurgu, Uzayda geçer, Devam filmleri var, Savaş
Avatar: Film, Bilim kurgu, Uzayda geçer, Devam filmleri var
Yıldızlararası: Film, Bilim kurgu, Uzayda geçer, Dram
Matrix: Film, Bilim kurgu, Aksiyon, Devam filmleri var
Jurassic Park: Film, Bilim kurgu, Gerilim, Hayvanlar var
Örümcek Adam: Film, Süper kahraman, Gençler, Devam filmleri var
Batman: Film, Süper kahraman, Suç, Devam filmleri var
Joker: Film, Dram, Suç, Gerilim
Baba: Film, Mafya, Suç, Ödüllü
Aslan Kral: Film, Animasyon, Hayvanlar var, Müzikal
Buz Devri: Film, Animasyon, Hayvanlar var, Komedi, Devam filmleri var
Shrek: Film, Animasyon, Komedi, Fantastik
Karayip Korsanları: Film, Gemide geçer, Aksiyon, Devam filmleri var, Fantastik
Hızlı ve Öfkeli: Film, Aksiyon, Arabalar, Devam filmleri var
Arabalar: Film, Animasyon, Arabalar, Komedi
Squid Game: Dizi, Gerilim, Dram
Game of Thrones: Dizi, Fantastik, Savaş, Ödüllü
Breaking Bad: Dizi, Suç, Dram, Ödüllü
Peaky Blinders: Dizi, Suç, Mafya, Tarihî
La Casa de Papel: Dizi, Suç, Aksiyon, Gerilim
Stranger Things: Dizi, Bilim kurgu, Gençler, Gerilim
Wednesday: Dizi, Gençler, Fantastik, Komedi
Friends: Dizi, Komedi, Romantik
Kurtlar Vadisi: Türk yapımı, Dizi, Mafya, Aksiyon
Ezel: Türk yapımı, Dizi, Suç, Dram
Behzat Ç.: Türk yapımı, Dizi, Suç, Polisiye
Arka Sokaklar: Türk yapımı, Dizi, Polisiye, Aksiyon
Leyla ile Mecnun: Türk yapımı, Dizi, Komedi
Avrupa Yakası: Türk yapımı, Dizi, Komedi
Muhteşem Yüzyıl: Türk yapımı, Dizi, Tarihî, Romantik
Diriliş Ertuğrul: Türk yapımı, Dizi, Tarihî, Savaş
Hababam Sınıfı: Türk yapımı, Film, Komedi, Gençler
Recep İvedik: Türk yapımı, Film, Komedi, Devam filmleri var
G.O.R.A.: Türk yapımı, Film, Komedi, Uzayda geçer, Bilim kurgu
Vizontele: Türk yapımı, Film, Komedi, Dram
Eşkıya: Türk yapımı, Film, Suç, Dram
`},
{ad:"Bizden", emoji:"🧿", renk:"#5b8cff,#17265e,#080d26", font:"Lobster", kalinlik:400, kose:32,
 susler:"🧿 ☕ 🎲 🪘 🕌 🫖", not:"Bu turun geleneği", kelimeler:`
Nazar boncuğu: Şans, Mavi, Gelenek
Kahve falı: Şans, Sohbet, Ev ziyareti
Hıdırellez: Gelenek, Baharda, Şans, Ateş
Nevruz: Baharda, Ateş, Gelenek
Mangal: Açık havada, Kalabalık, Ateş
Hamam: Tarihî, Gelenek, Sıcak
Kına gecesi: Düğünlerde, Gece, Gelenek, Eğlence
Halay: Dans, Düğünlerde, Kalabalık, Eğlence
Davul zurna: Müzik, Düğünlerde, Gürültülü
Asker uğurlaması: Kalabalık, Gelenek, Gürültülü
Zeybek: Dans, Gelenek
Semazen: Dans, Gelenek, Turistik
Mehter: Müzik, Tarihî, Gürültülü
Bağlama: Müzik, Telli, Türkü
Ud: Müzik, Telli
Bayram harçlığı: Bayramda, Çocuklar sever, Para
El öpmek: Bayramda, Gelenek, Ev ziyareti
Türk lokumu: Ev ziyareti, Bayramda, Tatlı
Kolonya: Ev ziyareti, Bayramda, Kokulu
Tavla: Oyun, Çayla, Kahvehanede
Okey: Oyun, Çayla, Kahvehanede
Çay bahçesi: Çayla, Açık havada, Sohbet
Kahvehane: Oyun, Sohbet, Çayla
Karagöz ve Hacivat: Masal, Tarihî, Komik
Nasreddin Hoca: Masal, Komik
Keloğlan: Masal, Çocuklar sever
Kapalıçarşı: İstanbul'da, Tarihî, Turistik, Alışveriş
Galata Kulesi: İstanbul'da, Tarihî, Turistik
Kız Kulesi: İstanbul'da, Turistik, Denizde
Vapurda simit: İstanbul'da, Denizde, Sokakta
Pamukkale: Turistik, Beyaz, Doğal
Ebru: El sanatı, Renkli
Kilim: El sanatı, Renkli, Evde
Çini: El sanatı, Mavi, Tarihî
Mahalle bakkalı: Sokakta, Alışveriş, Mahallede
Muhtar: Mahallede, Sohbet
Seyyar satıcı: Sokakta, Gürültülü, Mahallede
`}
];
