const { sequelize, Calendar, Category, Contact, Customer, Estimate, Invoice, Product, Task } = require('../models');

async function seed() {
    await sequelize.sync();

    const categories = await Category.bulkCreate([
        { name: 'Mobilier', description: 'Meubles anciens et vintage', icon: 'chair' },
        { name: 'Décoration', description: 'Objets déco, miroirs, cadres...', icon: 'frame' },
        { name: 'Vaisselle', description: 'Assiettes, verres, couverts...', icon: 'plate' }
    ]);

    const clients = await Customer.bulkCreate([
        { name: 'Alice', surname: 'Martin', adress: '1 rue de Paris', city: 'Paris', postal_code: 75001, company: 'Alice SARL', phone: 601234567, email: 'alice@gmail.fr' },
        { name: 'Bob', surname: 'Durand', adress: '2 avenue de Lyon', city: 'Lyon', postal_code: 69000, company: 'Durand SAS', phone: 602345678, email: 'bob@gmail.fr' },
        { name: 'Chloé', surname: 'Petit', adress: '3 bd de Lille', city: 'Lille', postal_code: 59000, company: 'Petit & Fils', phone: 603456789, email: 'chloe@gmail.fr' },
        { name: 'David', surname: 'Bernard', adress: '4 place de Nantes', city: 'Nantes', postal_code: 44000, company: 'Bernard SARL', phone: 604567890, email: 'david@gmail.fr' },
        { name: 'Emma', surname: 'Lefevre', adress: '5 allée de Nice', city: 'Nice', postal_code: 6000, company: 'Lefevre SAS', phone: 605678901, email: 'emma@gmail.fr' }
    ]);

    await Calendar.bulkCreate([
        { name: 'Brocante de Juin', description: 'Grand marché de juin', localisation: 'Place du marché', duration_time: 4, start_date: '2025-06-15', end_date: '2025-06-15', customer_id: clients[0].id },
        { name: 'Vide-grenier Juillet', description: 'Vide-grenier annuel', localisation: 'Rue principale', duration_time: 6, start_date: '2025-07-10', end_date: '2025-07-10', customer_id: clients[1].id },
        { name: 'Marché nocturne', description: 'Marché en soirée', localisation: 'Quai de la gare', duration_time: 3, start_date: '2025-07-25', end_date: '2025-07-25', customer_id: clients[2].id }
    ]);

    const products = await Product.bulkCreate([
        { name: 'Chaise bistrot', description: 'Chaise en bois typique', category_id: categories[0].id, condition: 'Bon', price: 35, sell_state: false, images: JSON.stringify(['uploads/image/2025/06/chaise.jpg']), quantity: 2, material: 'Bois', style: 'Vintage', buy_by: null },
        { name: 'Miroir doré', description: 'Miroir ancien cadre doré', category_id: categories[1].id, condition: 'Neuf', price: 80, sell_state: false, images: JSON.stringify(['uploads/image/2025/06/miroir.jpg']), quantity: 1, material: 'Bois', style: 'Classique', buy_by: null },
        { name: 'Service à thé', description: 'Service complet 6 personnes', category_id: categories[2].id, condition: 'Bon', price: 60, sell_state: false, images: JSON.stringify(['uploads/image/2025/06/the.jpg']), quantity: 1, material: 'Porcelaine', style: 'Art déco', buy_by: null },
        { name: 'Lampe industrielle', description: 'Lampe métal vintage', category_id: categories[1].id, condition: 'Presque Neuf', price: 45, sell_state: false, images: JSON.stringify(['uploads/image/2025/06/lampe.jpg']), quantity: 3, material: 'Métal', style: 'Industriel', buy_by: null },
        { name: 'Buffet années 50', description: 'Buffet en chêne massif', category_id: categories[0].id, condition: 'Bon', price: 150, sell_state: false, images: JSON.stringify(['uploads/image/2025/06/buffet.jpg']), quantity: 1, material: 'Chêne', style: 'Rétro', buy_by: null }
    ]);

    await Contact.bulkCreate([
        { name: 'Paul', surname: 'Roux', email: 'paul@ex.fr', phone: '0600000001', subject: 'Demande info produit', message: 'Bonjour, le miroir doré est-il toujours dispo ?', product_id: products[1].id },
        { name: 'Julie', surname: 'Morel', email: 'julie@ex.fr', phone: '0600000002', subject: 'Horaires ouverture', message: 'Bonjour, quels sont vos horaires en juillet ?', product_id: null },
        { name: 'Lucas', surname: 'Girard', email: 'lucas@ex.fr', phone: '0600000003', subject: 'Demande info produit', message: 'La lampe industrielle fonctionne-t-elle ?', product_id: products[3].id }
    ]);

    const estimate1 = await Estimate.create({
        creation_date: '2025-06-01',
        validity_date: '2025-07-01',
        object: 'Estimation mobilier',
        status: 'Envoyer',
        admin_note: 'Demande estimation mobilier',
        customer_id: clients[0].id,
        discount_name: 'Remise été',
        discount_value: 10,
        final_note: 'A valider'
    });
    const estimate2 = await Estimate.create({
        creation_date: '2025-07-01',
        validity_date: '2025-08-01',
        object: 'Estimation vaisselle',
        status: 'Envoyer',
        admin_note: 'Demande estimation vaisselle',
        customer_id: clients[1].id,
        discount_name: 'Remise fidélité',
        discount_value: 5,
        final_note: 'A valider'
    });

    await Task.bulkCreate([
        { name: 'Nettoyage buffet', description: 'Nettoyage complet', hours: 2, tva: '10.00', hourly_rate: 25, estimate_id: estimate1.id },
        { name: 'Restauration chaise', description: 'Réparation pieds', hours: 1, tva: '10.00', hourly_rate: 30, estimate_id: estimate1.id },
        { name: 'Emballage service', description: 'Emballage sécurisé', hours: 1, tva: '20.00', hourly_rate: 20, estimate_id: estimate2.id },
        { name: 'Livraison', description: 'Livraison à domicile', hours: 2, tva: '20.00', hourly_rate: 15, estimate_id: estimate2.id }
    ]);

    const invoice1 = await Invoice.create({
        creation_date: '2025-06-10',
        validity_date: '2025-07-10',
        object: 'Achat mobilier',
        status: 'Payé',
        admin_note: 'Achat buffet et chaise',
        customer_id: clients[2].id,
        discount_name: 'Remise spéciale',
        discount_value: 15
    });
    const invoice2 = await Invoice.create({
        creation_date: '2025-06-20',
        validity_date: '2025-07-20',
        object: 'Achat déco',
        status: 'Payé',
        admin_note: 'Achat miroir et lampe',
        customer_id: clients[3].id,
        discount_name: '',
        discount_value: 0
    });
    const invoice3 = await Invoice.create({
        creation_date: '2025-07-05',
        validity_date: '2025-08-05',
        object: 'Prestation nettoyage',
        status: 'Envoyer',
        admin_note: 'Nettoyage mobilier',
        customer_id: clients[4].id,
        discount_name: '',
        discount_value: 0
    });
    const invoice4 = await Invoice.create({
        creation_date: '2025-07-15',
        validity_date: '2025-08-15',
        object: 'Prestation livraison',
        status: 'Envoyer',
        admin_note: 'Livraison vaisselle',
        customer_id: clients[0].id,
        discount_name: '',
        discount_value: 0
    });

    await invoice1.addProduct(products[0].id, { through: { quantity: 1 } });
    await invoice1.addProduct(products[4].id, { through: { quantity: 1 } });
    await invoice2.addProduct(products[1].id, { through: { quantity: 1 } });
    await invoice2.addProduct(products[3].id, { through: { quantity: 2 } });

    await Task.create({ name: 'Nettoyage buffet', description: 'Nettoyage complet', hours: 2, tva: '10.00', hourly_rate: 25, invoice_id: invoice3.id });
    await Task.create({ name: 'Restauration chaise', description: 'Réparation pieds', hours: 1, tva: '10.00', hourly_rate: 30, invoice_id: invoice3.id });
    await Task.create({ name: 'Emballage service', description: 'Emballage sécurisé', hours: 1, tva: '20.00', hourly_rate: 20, invoice_id: invoice4.id });
    await Task.create({ name: 'Livraison', description: 'Livraison à domicile', hours: 2, tva: '20.00', hourly_rate: 15, invoice_id: invoice4.id });

    await Invoice.recalcTotals(invoice1.id);
    await Invoice.recalcTotals(invoice2.id);
    await Invoice.recalcTotals(invoice3.id);
    await Invoice.recalcTotals(invoice4.id);

    console.log('Seed terminé !');
    process.exit();
}

seed();