import React from 'react'
import BlogPost from '../../components/BlogPost'
import Header from '../../components/Header'
import PostModal from '../../components/PostModal'
import { useState } from 'react'


function Home() {


  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSavePost = (postData) => {
    // Perform any action you want with the saved post data
    console.log('Saved post:', postData);
  };
  return (
    <div>
    <div className='mt-20' >
      <div className=' flex justify-center'>
    <button
        onClick={handleOpenModal}
        className="bg-black  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Post
      </button>
      <PostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePost} 
      />
      </div>
<BlogPost/>
</div>

    </div>
  )
}

export default Home