const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/app');

describe('API Testing', () => {
  // 1. Pengujian GET untuk mendapatkan semua item
  it('should return all items', (done) => {
    request(app)
      .get('/api/items')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(2); // Karena kita sudah memiliki 2 item di controller
        done();
      });
  });

  // 2. Pengujian POST untuk membuat item baru
  it('should create a new item', (done) => {
    const newItem = { name: 'Item 3' };
    request(app)
      .post('/api/items')
      .send(newItem)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name', 'Item 3');
        done();
      });
  });

  // 3. Pengujian PUT untuk memperbarui item yang ada
  it('should update an existing item', (done) => {
    const updatedItem = { name: 'Updated Item 1' };
    request(app)
      .put('/api/items/1')
      .send(updatedItem)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', 1);
        expect(res.body).to.have.property('name', 'Updated Item 1');
        done();
      });
  });

  // 4. Pengujian PUT untuk mengupdate item dengan data baru
  it('should update an existing item with new data', (done) => {
    const updatedItem = { name: 'Updated Item 2' };
    request(app)
      .put('/api/items/2')
      .send(updatedItem)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', 2);
        expect(res.body).to.have.property('name', 'Updated Item 2');
        done();
      });
  });

  // 5. Pengujian DELETE untuk menghapus item yang ada
  it('should delete an existing item', (done) => {
    request(app)
      .delete('/api/items/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Item deleted successfully');

        // Verifikasi bahwa item telah dihapus
        request(app)
          .get('/api/items')
          .end((err, res) => {
            expect(res.body).to.not.deep.include({ id: 1, name: 'Updated Item 1' });
            done();
          });
      });
  });

  // 6. Pengujian untuk menghapus item yang tidak ada
  it('should return 404 when deleting a non-existing item', (done) => {
    request(app)
      .delete('/api/items/999') // ID yang tidak ada
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Item not found');
        done();
      });
  });

  // 7. Pengujian PUT untuk memperbarui item yang tidak ada
  it('should return 404 when updating a non-existing item', (done) => {
    const updatedItem = { name: 'Non-existing Item' };
    request(app)
      .put('/api/items/999') // ID yang tidak ada
      .send(updatedItem)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message', 'Item not found');
        done();
      });
  });
});
